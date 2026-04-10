#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <esp_now.h>
#include <WiFi.h>
#include <esp_wifi.h> // Necesario para fijar el canal

#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BME280 bme;
bool sensorPresente = false;

// 1. REEMPLAZA con la MAC de tu Receptor (la ves en su Monitor Serial al iniciar)
//44:1D:64:F3:C8:E8
uint8_t broadcastAddress[] = {0x44, 0x1D, 0x64, 0xF3, 0xC8, 0xE8};

typedef struct struct_message {
  int id;               
  float temperature;
  float humidity;
  float pressure;
  float altitude;
  float extra_variable; 
} struct_message;

struct_message myData;
esp_now_peer_info_t peerInfo;

void OnDataSent(const wifi_tx_info_t *mac_info, esp_now_send_status_t status) {
  Serial.print("\r\nEstado del último envío: ");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Éxito" : "Fallo");
}

void setup() {
  Serial.begin(115200);
  
  // Inicializar sensor
  if (bme.begin(0x76)) {
    Serial.println(F("BME280 detectado."));
    sensorPresente = true;
  } else {
    Serial.println(F("BME280 no encontrado. Datos en 0."));
    sensorPresente = false;
  }

  // 2. CONFIGURACIÓN CRÍTICA DE RED
  WiFi.mode(WIFI_STA);
  
  // DEBES CAMBIAR EL NUMERO '6' por el canal que use tu red 
  // El receptor te dirá qué canal es al conectarse.
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE); 

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error inicializando ESP-NOW");
    return;
  }

  esp_now_register_send_cb(OnDataSent);
  
  //La función memcpy(destino, origen, 6) lo que está haciendo es copiar 6 bytes.
  //Una dirección MAC (como 4C:11:AE:0D:8F:24) tiene exactamente 6 pares de números.
  //Si cambias ese 6 por un 1 o un 11 (el canal), la ESP32 solo copiará una parte de la dirección del receptor 
  //y el mensaje se perderá en el vacío porque la dirección estará incompleta.
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  // 0 significa "usar el canal actual del WiFi"
  peerInfo.encrypt = false;
  
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Fallo al añadir el peer");
    return;
  }

  Serial.println("-- Sender Listo --\n");
}

void loop() {
  myData.id = 2; // ID de este nodo
  myData.extra_variable = 0.0;

  if (sensorPresente) {
    myData.temperature = bme.readTemperature();
    myData.humidity = bme.readHumidity();
    myData.pressure = bme.readPressure() / 100.0F;
    myData.altitude = bme.readAltitude(SEALEVELPRESSURE_HPA);
  } else {
    myData.temperature = 0.0; myData.humidity = 0.0;
    myData.pressure = 0.0; myData.altitude = 0.0;
  }

  Serial.printf("Enviando -> T: %.2f | H: %.2f | P: %.2f\n", 
                myData.temperature, myData.humidity, myData.pressure);

  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
  
  delay(5000); // Envío cada 5 segundos
}