/*********
  Lectura de BME280 y transmisión vía ESP-NOW (Modo Tolerante a Fallos)
*********/

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <esp_now.h>
#include <WiFi.h>

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme; // I2C
bool sensorPresente = false; // Variable para saber si el sensor funciona

// REEMPLAZA CON LA DIRECCIÓN MAC DE LA ESP32 RECEPTORA
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

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
unsigned long delayTime;

void OnDataSent(const wifi_tx_info_t *mac_info, esp_now_send_status_t status) {
  Serial.print("\r\nEstado del último envío:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Éxito" : "Fallo");
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);

  // Intentar inicializar sensor
  if (bme.begin(0x76)) {
    Serial.println(F("BME280 detectado correctamente."));
    sensorPresente = true;
  } else {
    // YA NO USAMOS while(1). Solo avisamos por serial.
    Serial.println(F("ADVERTENCIA: BME280 no encontrado. Se enviarán datos en 0."));
    sensorPresente = false;
  }

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error inicializando ESP-NOW");
    return;
  }

  esp_now_register_send_cb(OnDataSent);
  
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;
  
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Fallo al añadir el peer");
    return;
  }

  delayTime = 2000;
  Serial.println("-- Setup Terminado --\n");
}

void loop() {
  myData.id = 2;
  myData.extra_variable = 0.0;

  // Lógica de lectura condicional
  if (sensorPresente) {
    // Si el sensor está, leemos valores reales
    myData.temperature = bme.readTemperature();
    myData.humidity = bme.readHumidity();
    myData.pressure = bme.readPressure() / 100.0F;
    myData.altitude = bme.readAltitude(SEALEVELPRESSURE_HPA);
  } else {
    // Si NO está, forzamos todo a cero
    myData.temperature = 0.0;
    myData.humidity = 0.0;
    myData.pressure = 0.0;
    myData.altitude = 0.0;
    
    // Opcional: Intentar reconectar el sensor en cada loop por si se soltó el cable
    if (bme.begin(0x76)) sensorPresente = true; 
  }

  // Monitor Serial Local
  Serial.printf("Enviando -> T: %.2f | H: %.2f | P: %.2f\n", 
                myData.temperature, myData.humidity, myData.pressure);

  // Enviar por ESP-NOW
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
  
  delay(delayTime);
}