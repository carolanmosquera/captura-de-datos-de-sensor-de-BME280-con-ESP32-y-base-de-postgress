#include <esp_now.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>   // para MQTT
#include <WiFiClient.h>     // cliente TCP

//"LABREDES"
//"F0rmul4-1"

//"PUBLICA"
//""

//"IASLAB"
//"Sys-2019"

//FAMOME
//"camo761203"


// ================== CONFIGURACIÓN DE RED ==================
const char* ssid     = "IASLAB"; 
const char* password = "Sys-2019";

const char* serverUrl = "http://192.168.131.153:8081/api/rest/telemetry";

// Umbral de tiempo para considerar un nodo inactivo (ej: 30 segundos)
unsigned long offlineThreshold = 1200000;

// Configuración MQTT
const char* mqtt_server = "192.168.131.153";  // IP de tu broker (o dominio)
const int mqtt_port = 1883;
const char* mqtt_user = "";     // si no usas autenticación, déjalos vacíos
const char* mqtt_password = "";
const char* mqtt_topic_sub = "sensores/commands/1";  // tópico para este receptor (puedes usar otro ID)

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Bandera para pausar/reanudar el envío de datos (por defecto enviando)
volatile bool enviarDatosHabilitado = true;

// ================== ESTRUCTURA DE DATOS ==================
typedef struct struct_message {
  int id;
    float temperature;
    float humidity;
    float pressure;
    float altitude;
    float extra_variable;
    int sensor_status;    // 1 para OK, 0 para falla
} struct_message;

#define MAX_DEVICES 10
struct_message devicesData[MAX_DEVICES];
unsigned long lastSeen[MAX_DEVICES]; // Para rastrear la última vez que enviaron datos
bool wasActive[MAX_DEVICES];         // Para saber si ya reportamos la inactividad

// ---> LA BANDERA <---
volatile int pendingNodeId = -1; 

// ================== FUNCIÓN POST ==================
void POSTRequest(String url, String data) {
  HTTPClient http;
  
  // Agregamos un timeout para que no se quede colgado
  http.setTimeout(10000); 
  
  http.begin(url.c_str());                        // TCP handshake
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(data);          // HTTP request
  Serial.print("Codigo respuesta: ");
  Serial.println(httpResponseCode);
  
  if (httpResponseCode == 201 || httpResponseCode == 200) {
    String responseBody = http.getString();
    Serial.println("Respuesta: " + responseBody);
  } else {
    Serial.printf("Error en HTTP request: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  http.end();
}

// ================== FUNCIÓN: MQTT ==================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("MQTT message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println(message);

  if (message == "PAUSE") {
    enviarDatosHabilitado = false;
    Serial.println(">>> Envío de datos PAUSADO por comando MQTT");
  } else if (message == "RESUME") {
    enviarDatosHabilitado = true;
    Serial.println(">>> Envío de datos REANUDADO por comando MQTT");
  }
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Conectando a MQTT...");
    // Si el broker requiere autenticación:
    if (mqtt_user[0] == '\0')
      mqttClient.connect("ESP32-Receptor");
    else
      mqttClient.connect("ESP32-Receptor", mqtt_user, mqtt_password);

    if (mqttClient.connected()) {
      Serial.println("conectado!");
      mqttClient.subscribe(mqtt_topic_sub);
      Serial.print("Suscrito a: ");
      Serial.println(mqtt_topic_sub);
    } else {
      Serial.print("falló, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" reintentando en 5 segundos");
      delay(5000);
    }
  }
}

// ================== FUNCIÓN: ENVIAR AL SERVIDOR ==================
// Agregamos el parámetro String status a la firma
void sendToServer(struct_message& data, String status,bool esInactividad = false) {

  // Si NO es inactividad Y el envío está pausado, descartamos datos
  if (!esInactividad && !enviarDatosHabilitado) {
    Serial.println("Envío pausado por MQTT - datos descartados");
    return;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado, reconectando...");
    WiFi.begin(ssid, password);
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 10) {
      delay(500);
      Serial.print(".");
      retries++;
    }
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("\nNo se pudo reconectar");
      return;
    }
  }

  // Construir JSON
  // Aumentamos el tamaño del documento si hay nuevos campos
  StaticJsonDocument<300> doc;
  doc["nodeId"]        = data.id;
  doc["temperature"]   = data.temperature;
  doc["humidity"]      = data.humidity;
  doc["pressure"]      = data.pressure;
  doc["altitude"]      = data.altitude;
  doc["extraVariable"] = data.extra_variable;
  doc["sensorStatus"]  = data.sensor_status; // Dato del BME280 (SENSOR)
  doc["nodeStatus"]    = status;         // "activo" o "inactivo" (ESCLAVA CONECTADA A MASTER)
  doc["macMaster"]     = WiFi.macAddress(); 
  doc["canalConection"] = WiFi.channel();

  String jsonBody;
  serializeJson(doc, jsonBody);

  Serial.print("Enviando: ");
  Serial.println(jsonBody);

  POSTRequest(String(serverUrl), jsonBody);
}

// ================== CALLBACK ESP-NOW ==================
void OnDataRecv(const esp_now_recv_info_t *info, const uint8_t *incomingData, int len) {
  char macStr[18];
  snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
           info->src_addr[0], info->src_addr[1], info->src_addr[2],
           info->src_addr[3], info->src_addr[4], info->src_addr[5]);

  struct_message receivedData;
  memcpy(&receivedData, incomingData, sizeof(receivedData));

  if (receivedData.id >= 1 && receivedData.id <= MAX_DEVICES) {
    int index = receivedData.id - 1;
    devicesData[receivedData.id - 1] = receivedData;

    //Actualizar el tiempo de vida y estado
    lastSeen[index] = millis();
    wasActive[index] = true;

    Serial.printf("\n[Rx] ID:%d S_Stat:%d T:%.2f H:%.2f P:%.2f\n",
                  receivedData.id, receivedData.sensor_status,
                  receivedData.temperature, receivedData.humidity, 
                  receivedData.pressure);
                  
    // Levantamos la bandera en lugar de enviar el POST aquí
    pendingNodeId = receivedData.id; 
  } else {
    Serial.println("ERROR: ID fuera de rango");
  }
}

// ================== SETUP ==================
void setup() {
  Serial.begin(115200);
  Serial.println("\nIniciando Receptor ESP-NOW + HTTP");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConectado!");
  Serial.println(WiFi.localIP());
  Serial.print("MAC del Receptor: ");
  Serial.println(WiFi.macAddress()); // Verifica si coincide con la del Sender
  Serial.print("Canal WiFi actual: ");
  Serial.println(WiFi.channel());    // Este es el dato clave
  

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error ESP-NOW");
    return;
  }
  esp_now_register_recv_cb(OnDataRecv);

  for (int i = 0; i < MAX_DEVICES; i++) {
    devicesData[i].id = 0;
    wasActive[i] = false; // Importante empezar en falso
  }

  Serial.println("Listo, esperando datos...");

  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
}

// ================== LOOP ==================
void loop() {
  if (!mqttClient.connected()) reconnectMQTT();
  mqttClient.loop();
  // El loop revisa tranquilamente si hay trabajo pendiente
  // 1. Si recibimos datos, enviarlos inmediatamente como "activo"
  if (pendingNodeId != -1) {
    int id = pendingNodeId;
    pendingNodeId = -1; // Bajamos la bandera
    sendToServer(devicesData[id - 1], "activo",false); // Hacemos el POST pesado aquí (ACA SE DEFINE STATUS)
  }

  // 2. Verificar si algún nodo se pasó del tiempo de espera (Inactivo)
  for (int i = 0; i < MAX_DEVICES; i++) {
    if (wasActive[i] && (millis() - lastSeen[i] > offlineThreshold)) {
      wasActive[i] = false; // Marcamos como inactivo para no repetir el aviso
      
      Serial.printf("\n[ALERTA] Nodo %d ha superado el tiempo de espera!\n", i + 1);
      
      // Enviamos un objeto mínimo indicando la inactividad
      struct_message offData;
      offData.id = i + 1;
      offData.temperature = 0; offData.humidity = 0; offData.pressure = 0;
      offData.altitude = 0; offData.extra_variable = 0; offData.sensor_status = 0;
      
      sendToServer(offData, "inactivo",true);
    }
  }
  delay(10);
}