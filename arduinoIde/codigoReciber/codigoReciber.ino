#include <esp_now.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ================== CONFIGURACIÓN DE RED ==================
const char* ssid     = "TU_WIFI_SSID";
const char* password = "TU_WIFI_PASSWORD";

// URL de tu aplicación en Render
const char* serverUrl = "https://TU-APP.onrender.com/api/rest/telemetry";

// ================== ESTRUCTURA DE DATOS ==================
typedef struct struct_message {
  int id;
  float temperature;
  float humidity;
  float pressure;
  float altitude;
  float extra_variable;
} struct_message;

#define MAX_DEVICES 10
struct_message devicesData[MAX_DEVICES];

// ================== FUNCIÓN: ENVIAR HTTP POST ==================
void sendToServer(struct_message& data) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado, intentando reconectar...");
    WiFi.begin(ssid, password);
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 10) {
      delay(500);
      Serial.print(".");
      retries++;
    }
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("\nNo se pudo reconectar al WiFi");
      return;
    }
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // Construir JSON que coincide con tu modelo SensorData
  StaticJsonDocument<256> doc;
  doc["nodeId"]        = data.id;
  doc["temperature"]   = data.temperature;
  doc["humidity"]      = data.humidity;
  doc["pressure"]      = data.pressure;
  doc["altitude"]      = data.altitude;
  doc["extraVariable"] = data.extra_variable;
  // timestamp lo asigna el servidor automáticamente si es null

  String jsonBody;
  serializeJson(doc, jsonBody);

  Serial.print("Enviando JSON: ");
  Serial.println(jsonBody);

  int httpResponseCode = http.POST(jsonBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("Respuesta del servidor [%d]: %s\n", httpResponseCode, response.c_str());
  } else {
    Serial.printf("Error en POST: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// ================== CALLBACK DE RECEPCIÓN ESP-NOW ==================
void OnDataRecv(const esp_now_recv_info_t *info, const uint8_t *incomingData, int len) {
  char macStr[18];
  snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
           info->src_addr[0], info->src_addr[1], info->src_addr[2],
           info->src_addr[3], info->src_addr[4], info->src_addr[5]);

  Serial.print("\nPaquete recibido de: ");
  Serial.println(macStr);

  struct_message receivedData;
  memcpy(&receivedData, incomingData, sizeof(receivedData));

  if (receivedData.id >= 1 && receivedData.id <= MAX_DEVICES) {
    devicesData[receivedData.id - 1] = receivedData;

    Serial.printf("ID: %d | Temp: %.2f°C | Hum: %.2f%% | Pres: %.2f hPa | Alt: %.2f m\n",
                  receivedData.id, receivedData.temperature, receivedData.humidity,
                  receivedData.pressure, receivedData.altitude);

    // Enviar inmediatamente al servidor
    sendToServer(devicesData[receivedData.id - 1]);

  } else {
    Serial.println("ERROR: ID del dispositivo fuera de rango");
  }
}

// ================== SETUP ==================
void setup() {
  Serial.begin(115200);
  Serial.println("\nIniciando Receptor ESP-NOW + HTTP");

  // Conectar a WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Inicializar ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error al inicializar ESP-NOW");
    return;
  }
  esp_now_register_recv_cb(OnDataRecv);

  // Inicializar array
  for (int i = 0; i < MAX_DEVICES; i++) {
    devicesData[i].id = 0;
  }

  Serial.printf("Listo. Esperando datos de hasta %d dispositivos...\n", MAX_DEVICES);
}

// ================== LOOP ==================
void loop() {
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 30000) {  // Resumen cada 30 segundos
    lastPrint = millis();
    Serial.println("\n=== Resumen ===");
    for (int i = 0; i < MAX_DEVICES; i++) {
      if (devicesData[i].id != 0) {
        Serial.printf("Nodo %d: Temp=%.2f°C Hum=%.2f%%\n",
                      devicesData[i].id,
                      devicesData[i].temperature,
                      devicesData[i].humidity);
      }
    }
    Serial.println("===============\n");
  }
  delay(10);  // Sin delay largo para no bloquear ESP-NOW
}