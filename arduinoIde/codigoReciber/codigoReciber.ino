#include <esp_now.h>
#include <WiFi.h>

// ================== ESTRUCTURA DE DATOS (IDÉNTICA AL EMISOR) ==================
typedef struct struct_message {
  int id;               // Identificador único del nodo (1, 2, 3, ...)
  float temperature;
  float humidity;
  float pressure;
  float altitude;
  float extra_variable; // Para futura expansión (NPK, pH, etc.)
} struct_message;

// ================== CONFIGURACIÓN ESCALABLE ==================
#define MAX_DEVICES 10   // Máximo número de dispositivos emisores esperados
struct_message devicesData[MAX_DEVICES];  // Array para almacenar los datos de cada dispositivo

// ================== CALLBACK DE RECEPCIÓN ==================
void OnDataRecv(const esp_now_recv_info_t *info, const uint8_t *incomingData, int len) {
  char macStr[18];
  
  // AQUÍ ESTÁ EL CAMBIO: Usamos info->src_addr en lugar de mac_addr
  snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
           info->src_addr[0], info->src_addr[1], info->src_addr[2], 
           info->src_addr[3], info->src_addr[4], info->src_addr[5]);
           
  Serial.print("Paquete recibido de: ");
  Serial.println(macStr);

  struct_message receivedData;
  memcpy(&receivedData, incomingData, sizeof(receivedData));

  Serial.printf("ID del dispositivo: %d\n", receivedData.id);
  Serial.printf("Tamaño del paquete: %d bytes\n", len);

  // Validar que el ID esté dentro del rango permitido
  if (receivedData.id >= 1 && receivedData.id <= MAX_DEVICES) {
    // Almacenar los datos en la posición correspondiente (id-1)
    devicesData[receivedData.id - 1] = receivedData;

    // Mostrar los datos recibidos
    Serial.printf("Temperatura: %.2f °C\n", devicesData[receivedData.id - 1].temperature);
    Serial.printf("Humedad: %.2f %%\n", devicesData[receivedData.id - 1].humidity);
    Serial.printf("Presión: %.2f hPa\n", devicesData[receivedData.id - 1].pressure);
    Serial.printf("Altitud: %.2f m\n", devicesData[receivedData.id - 1].altitude);
    Serial.printf("Variable extra: %.2f\n", devicesData[receivedData.id - 1].extra_variable);
    Serial.println("-----------------------------------");
  } else {
    Serial.println("ERROR: ID del dispositivo fuera de rango");
  }
}

// ================== SETUP ==================
void setup() {
  Serial.begin(115200);
  Serial.println("\nIniciando Receptor ESP-NOW (escalable)");

  // Configurar como estación Wi-Fi
  WiFi.mode(WIFI_STA);

  // Inicializar ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error al inicializar ESP-NOW");
    return;
  }

  // Registrar la función callback para cuando lleguen datos
  esp_now_register_recv_cb(OnDataRecv);

  // Inicializar el array de dispositivos con valores por defecto
  for (int i = 0; i < MAX_DEVICES; i++) {
    devicesData[i].id = 0;               // 0 indica que no hay datos válidos aún
    devicesData[i].temperature = 0;
    devicesData[i].humidity = 0;
    devicesData[i].pressure = 0;
    devicesData[i].altitude = 0;
    devicesData[i].extra_variable = 0;
  }

  Serial.printf("Receptor listo. Esperando datos de hasta %d dispositivos...\n", MAX_DEVICES);
}

// ================== LOOP ==================
void loop() {
  // Aquí puedes acceder a los datos de cada dispositivo en cualquier momento.
  // Ejemplo: imprimir cada 5 segundos los valores del dispositivo 1 y 2.
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 5000) {
    lastPrint = millis();
    Serial.println("\n=== Resumen de últimos datos recibidos ===");
    for (int i = 0; i < MAX_DEVICES; i++) {
      if (devicesData[i].id != 0) {  // Si se ha recibido al menos un paquete de este dispositivo
        Serial.printf("Dispositivo ID %d:\n", devicesData[i].id);
        Serial.printf("  Temp: %.2f °C, Hum: %.2f %%, Pres: %.2f hPa, Alt: %.2f m\n",
                      devicesData[i].temperature, devicesData[i].humidity,
                      devicesData[i].pressure, devicesData[i].altitude);
      }
    }
    Serial.println("=========================================\n");
  }

  delay(60000);  // Pequeña pausa para no saturar el procesador
}