
## Paso a paso para ejecutar el proyecto

Este proyecto puede ejecutarse de dos maneras:

- con **Neon** como base de datos remota
- con **PostgreSQL local en Docker** y **pgAdmin**

---

# Opción 1: Ejecutar el proyecto con Neon

### 1. Abre una terminal en la raíz del proyecto
Ubícate en la carpeta donde está el archivo `pom.xml`.

### 2. Activa el profile de Neon

#### En Windows CMD
```bat
set SPRING_PROFILES_ACTIVE=neon
set SERVER_PORT=8081
mvn clean spring-boot:run
````

#### En Windows PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="neon"
$env:SERVER_PORT="8081"
mvn clean spring-boot:run
```

### 3. Accede a la aplicación

Abre en el navegador:

```text
http://localhost:8081
```

> Si el puerto `8081` está ocupado, cambia el valor de `SERVER_PORT` por otro, por ejemplo `8082` o `8085`.

---

# Opción 2: Ejecutar el proyecto con PostgreSQL local y pgAdmin usando Docker

### 1. Abre una terminal en la raíz del proyecto

Ubícate en la carpeta donde está el archivo `docker-compose.yml`.

### 2. Levanta los contenedores

#### En CMD

```bat
docker compose up --build
```

#### En PowerShell

```powershell
docker compose up --build
```

Si quieres dejarlos corriendo en segundo plano:

#### En CMD

```bat
docker compose up --build -d
```

#### En PowerShell

```powershell
docker compose up --build -d
```

### 3. Verifica que los contenedores estén corriendo

#### En CMD

```bat
docker compose ps
```

#### En PowerShell

```powershell
docker compose ps
```

### 4. Activa el profile de local

#### En Windows CMD
```bat
set SPRING_PROFILES_ACTIVE=local
set SERVER_PORT=8082
mvn clean spring-boot:run
````

#### En Windows PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="local"
$env:SERVER_PORT="8081"
mvn clean spring-boot:run
```


### 5. Accede a los servicios

* API Spring Boot:

```text
http://localhost:8081
```

En la local no hay nada entonces normal si aparece un 404, probar que esta todo bien es con esta ruta

```text
http://localhost:8081/mvc/telemetry
```

* pgAdmin:

```text
http://localhost:8888
```

### 5. Inicia sesión en pgAdmin

Usa las credenciales configuradas en el `docker-compose.yml`:

```text
Email: admin@admin.com
Password: admin123
```

Abre tu navegador en `http://localhost:8888` e ingresa las credenciales definidas en el `docker-compose.yml`:

- **Email**: `admin@admin.com`
- **Contraseña**: `admin123`

### 6. Registra el servidor PostgreSQL en pgAdmin

Dentro de pgAdmin, crea un nuevo servidor con estos datos:

```text
Name: sensores-postgres
Host: db
Port: 5432
Database: sensoresdb
Username: admin
Password: admin123
```
Abre tu navegador en `http://localhost:8888` e ingresa las credenciales definidas en el `docker-compose.yml`:

- **Email**: `admin@admin.com`
- **Contraseña**: `admin123`

Haz clic en **Save**. El servidor aparecerá en el panel izquierdo.

> Importante: el host debe ser `db`, no `localhost`, porque pgAdmin y PostgreSQL están dentro de Docker.

### 7. Visualiza las tablas y los datos

Despliega el árbol hasta `sensores-postgres` → `Databases` → `sensoresdb` → `Schemas` → `public` → `Tables`.  
Verás la tabla `sensor_data`. Haz clic derecho sobre ella y selecciona **View/Edit Data** → **All Rows** para ver todas las filas insertadas.

También puedes ejecutar consultas personalizadas desde **Tools** → **Query Tool**. Por ejemplo:

```sql
SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 10;

---

# Comandos útiles

### Ver logs de todos los servicios

#### En CMD

```bat
docker compose logs
```

#### En PowerShell

```powershell
docker compose logs
```

### Ver logs de la API

#### En CMD

```bat
docker compose logs api
```

#### En PowerShell

```powershell
docker compose logs api
```

### Ver logs en tiempo real

#### En CMD

```bat
docker compose logs -f
```

#### En PowerShell

```powershell
docker compose logs -f
```

### Detener los contenedores

#### En CMD

```bat
docker compose down
```

#### En PowerShell

```powershell
docker compose down
```

### Detener y eliminar volúmenes

#### En CMD

```bat
docker compose down -v
```

#### En PowerShell

```powershell
docker compose down -v
```

---

# Ejecución local sin Docker

## Con Neon

### En Windows CMD

```bat
set SPRING_PROFILES_ACTIVE=neon
set SERVER_PORT=8081
mvn clean spring-boot:run
```

### En Windows PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="neon"
$env:SERVER_PORT="8081"
mvn clean spring-boot:run
```

## Con configuración local

### En Windows CMD

```bat
set SPRING_PROFILES_ACTIVE=local
set SERVER_PORT=8081
mvn clean spring-boot:run
```

### En Windows PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="local"
$env:SERVER_PORT="8081"
mvn clean spring-boot:run
```

---

# Resumen rápido

## Con Neon

### CMD

```bat
set SPRING_PROFILES_ACTIVE=neon
set SERVER_PORT=8081
mvn clean spring-boot:run
```

### PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="neon"
$env:SERVER_PORT="8081"
mvn clean spring-boot:run
```

## Con PostgreSQL local en Docker

### CMD

```bat
docker compose up --build
```

### PowerShell

```powershell
docker compose up --build
```

```
```
# Captura de Datos de Sensor BME280 con ESP32 y PostgreSQL

Sistema IoT completo que captura variables ambientales desde sensores **BME280** conectados a nodos **ESP32 emisores**, los transmite por **ESP-NOW** a un nodo receptor que los reenvía vía **HTTP POST** a una aplicación **Spring Boot** desplegada en **Render**, la cual los persiste en **PostgreSQL (Neon)** y los visualiza en un dashboard web con **Thymeleaf** y **Chart.js**.

---

## Tabla de contenidos

1. [Arquitectura del sistema](#1-arquitectura-del-sistema)
2. [Tecnologías utilizadas](#2-tecnologías-utilizadas)
3. [Estructura del repositorio](#3-estructura-del-repositorio)
4. [Arduino — Nodo Emisor (`codigoSender.ino`)](#4-arduino--nodo-emisor-codigosenderino)
5. [Arduino — Nodo Receptor (`codigoReciber.ino`)](#5-arduino--nodo-receptor-codigoreciberino)
6. [Java — `SensoresApplication.java`](#6-java--sensoresapplicationjava)
7. [Java — `ServletInitializer.java`](#7-java--servletinitializerjava)
8. [Java — `SensorData.java` (Modelo)](#8-java--sensordatajava-modelo)
9. [Java — `SensorDataRepository.java` (Repositorio)](#9-java--sensordatarepository-repositorio)
10. [Java — `SensorService.java` (Interfaz de servicio)](#10-java--sensorservicejava-interfaz-de-servicio)
11. [Java — `SensorServiceImp.java` (Implementación)](#11-java--sensorserviceimpjava-implementación)
12. [Java — `SensorRestController.java` (API REST)](#12-java--sensorrestcontrollerjava-api-rest)
13. [Java — `SensorMvcController.java` (Vistas web)](#13-java--sensormvccontrollerjava-vistas-web)
14. [Thymeleaf — `dashboard.html`](#14-thymeleaf--dashboardhtml)
15. [Thymeleaf — `data-fragment.html`](#15-thymeleaf--data-fragmenthtml)
16. [Configuración — `application.properties`](#16-configuración--applicationproperties)
17. [Despliegue — `Dockerfile`](#17-despliegue--dockerfile)
18. [Dependencias — `pom.xml`](#18-dependencias--pomxml)
19. [Endpoints disponibles](#19-endpoints-disponibles)
20. [Cómo correr el proyecto localmente](#20-cómo-correr-el-proyecto-localmente)

---

## 1. Arquitectura del sistema

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          RED LOCAL (WiFi / ESP-NOW)                      │
│                                                                          │
│   ┌────────────────────┐    ESP-NOW (binario)   ┌──────────────────────┐ │
│   │  ESP32 EMISOR       │ ─────────────────────► │  ESP32 RECEPTOR      │ │
│   │  + Sensor BME280   │   sin WiFi, sin IP     │  conectado a WiFi    │ │
│   │  id = 1, 2, 3...   │   solo radio 2.4 GHz   │  HTTPClient activo   │ │
│   └────────────────────┘                        └──────────┬───────────┘ │
│                                                            │             │
└────────────────────────────────────────────────────────────┼─────────────┘
                                                             │ HTTP POST
                                                             │ JSON
                                              ┌──────────────▼─────────────┐
                                              │   Spring Boot en Render     │
                                              │   Puerto 8080               │
                                              │   /api/rest/telemetry POST  │
                                              │   /api/rest/telemetry GET   │
                                              │   /mvc/telemetry (HTML)     │
                                              └──────────────┬─────────────┘
                                                             │ JDBC / JPA / Hibernate
                                              ┌──────────────▼─────────────┐
                                              │   PostgreSQL en Neon        │
                                              │   tabla: sensor_data        │
                                              └────────────────────────────┘
```

### Flujo completo de un dato (paso a paso)

```
1. BME280 lee: temperatura=24.5°C, humedad=63%, presión=1012hPa, altitud=1534m
       │
       ▼
2. ESP32 Emisor empaqueta los valores en una struct_message (24 bytes)
   y llama esp_now_send() → transmite por radio 2.4 GHz en canal WiFi fijo
       │
       ▼
3. ESP32 Receptor recibe el paquete → callback OnDataRecv() se ejecuta
   → guarda la struct en devicesData[id-1]
   → levanta bandera pendingNodeId = id   ← NUEVO: no bloquea la interrupción
       │
       ▼
4. Loop() detecta pendingNodeId != -1 → llama sendToServer()
   → construye JSON con ArduinoJson
   → HTTP POST al servidor Spring Boot
       │
       ▼
5. SensorRestController.receiveTelemetry() desserializa el JSON → SensorData
   → @PrePersist asigna timestamp = LocalDateTime.now()
   → sensorService.save() → JPA INSERT en PostgreSQL
       │
       ▼
6. Neon PostgreSQL almacena la fila en la tabla sensor_data
       │
       ▼
7. Dashboard web (navegador) hace fetch() a /api/rest/telemetry/last10/{nodeId}
   → Chart.js dibuja líneas de temperatura y humedad en tiempo real
```

---

## 2. Tecnologías utilizadas

| Capa | Tecnología | Versión | Rol |
|---|---|---|---|
| Sensor físico | BME280 (Bosch) | — | Lee temperatura, humedad, presión, altitud por I2C |
| Microcontrolador | ESP32 (Espressif) | ESP-IDF 5.x | Ejecuta el firmware Arduino |
| Protocolo inalámbrico | ESP-NOW | — | Comunicación P2P sin router entre ESP32 |
| Protocolo HTTP | HTTPClient (Arduino) | — | POST desde el receptor a Spring Boot |
| Serialización IoT | ArduinoJson | 6.x | Construye el JSON a enviar |
| Backend | Spring Boot | 3.3.0 | Recibe, valida, persiste y expone los datos |
| ORM | Spring Data JPA / Hibernate | 6.5 | Mapea objetos Java a filas SQL |
| Base de datos | PostgreSQL (Neon) | 16 | Almacenamiento persistente en la nube |
| Plantillas SSR | Thymeleaf | 3.x | Renderiza el dashboard en el servidor |
| Gráficas | Chart.js | CDN última | Dibuja líneas de temperatura y humedad |
| Despliegue | Render | — | Hosting del contenedor Docker |
| Contenedor | Docker multi-stage | — | Build reproducible y ligero |
| Build Java | Maven | 3.9.14 | Gestiona dependencias y compila |
| Lenguaje Java | Java | 17 | Lógica del backend |
| Reducción boilerplate | Lombok | — | Genera getters, setters, constructores |

---

## 3. Estructura del repositorio

```
proyecto/
├── arduinoIde/
│   ├── codigoSender/
│   │   └── codigoSender.ino        ← Firmware del ESP32 con BME280 (emisor)
│   └── codigoReciber/
│       └── codigoReciber.ino       ← Firmware del ESP32 receptor + HTTP POST
└── aplicacionJava/
    └── sensores/
        ├── Dockerfile               ← Build multi-stage para Render
        ├── pom.xml                  ← Dependencias Maven
        └── src/
            └── main/
                ├── java/com/example/sensores/
                │   ├── SensoresApplication.java          ← Punto de entrada
                │   ├── ServletInitializer.java           ← Compatibilidad WAR
                │   ├── controller/
                │   │   ├── rest/SensorRestController.java ← API JSON para ESP32
                │   │   └── mvc/SensorMvcController.java  ← Vistas HTML
                │   ├── model/
                │   │   └── SensorData.java               ← Entidad JPA
                │   ├── repository/
                │   │   └── SensorDataRepository.java     ← Acceso a BD
                │   └── service/
                │       ├── SensorService.java            ← Contrato del servicio
                │       └── serviceImpl/
                │           └── SensorServiceImp.java     ← Lógica de negocio
                └── resources/
                    ├── application.properties            ← Configuración
                    └── templates/telemetry/
                        ├── dashboard.html                ← Vista principal
                        └── data-fragment.html            ← Fragmento tabla
```

---

## 4. Arduino — Nodo Emisor (`codigoSender.ino`)

El emisor captura datos del sensor BME280 y los transmite por ESP-NOW al receptor. **No se conecta a ninguna red WiFi** — solo usa el hardware de radio WiFi del ESP32 para el protocolo ESP-NOW.

### Código completo con explicación línea por línea

```cpp
#include <Wire.h>
```
Librería estándar de Arduino para comunicación **I2C** (Inter-Integrated Circuit). El BME280 se conecta al ESP32 por este protocolo usando dos cables: SDA (datos) y SCL (reloj). Sin esta librería, `Adafruit_BME280` no puede comunicarse con el sensor.

```cpp
#include <Adafruit_Sensor.h>
```
Librería base de Adafruit que define una interfaz unificada para todos sus sensores. `Adafruit_BME280` hereda de ella. No se usa directamente pero es una dependencia obligatoria.

```cpp
#include <Adafruit_BME280.h>
```
Driver específico para el sensor BME280. Provee funciones de alto nivel como `readTemperature()`, `readHumidity()`, `readPressure()` y `readAltitude()` que internamente gestionan los registros del chip.

```cpp
#include <esp_now.h>
```
API oficial de Espressif para el protocolo **ESP-NOW**. Permite enviar paquetes de hasta 250 bytes directamente entre ESP32 sin necesidad de un router o dirección IP. Trabaja en la capa de enlace de datos (capa 2 del modelo OSI).

```cpp
#include <WiFi.h>
```
Librería WiFi del ESP32. Aunque el emisor no se conecta a ninguna red, ESP-NOW requiere que el hardware WiFi esté encendido y en modo estación (`WIFI_STA`). Esta librería lo controla.

```cpp
#include <esp_wifi.h>
```
API de bajo nivel de Espressif para configurar parámetros WiFi que no expone la librería `WiFi.h` de Arduino. Se usa aquí para `esp_wifi_set_channel()` — función crítica para fijar el canal de radio.

```cpp
#define SEALEVELPRESSURE_HPA (1013.25)
```
Constante de preprocesador: presión atmosférica media a nivel del mar en hectopascales (hPa). El BME280 usa este valor de referencia para calcular la altitud. Si la presión real en tu ubicación difiere significativamente, la altitud calculada tendrá error.

```cpp
Adafruit_BME280 bme;
```
Crea una instancia del objeto sensor. En este momento solo se declara; la comunicación I2C real ocurre cuando se llama `bme.begin()` en el `setup()`.

```cpp
bool sensorPresente = false;
```
**Bandera de modo tolerante a fallos.** Si el BME280 no está conectado o falla, el sistema no se bloquea — continúa enviando ceros. Esto permite probar el sistema de comunicación ESP-NOW y HTTP independientemente del sensor físico.

```cpp
uint8_t broadcastAddress[] = {0x44, 0x1D, 0x64, 0xF3, 0xC8, 0xE8};
```
Dirección MAC del ESP32 receptor en formato de arreglo de 6 bytes sin signo (`uint8_t`). Una dirección MAC tiene exactamente 6 bytes — los dos puntos (`:`) solo son notación visual. Para obtener la MAC del receptor, este la imprime en el Monitor Serial al iniciar: `WiFi.macAddress()`. **Este valor debe actualizarse para cada despliegue.**

```cpp
typedef struct struct_message {
  int id;               // 4 bytes — identificador único del nodo emisor
  float temperature;    // 4 bytes — temperatura en °C
  float humidity;       // 4 bytes — humedad relativa en %
  float pressure;       // 4 bytes — presión atmosférica en hPa
  float altitude;       // 4 bytes — altitud calculada en metros
  float extra_variable; // 4 bytes — campo reservado para expansión futura
} struct_message;
```
**Estructura de datos compartida** entre el emisor y el receptor. Esta es la pieza más crítica del sistema ESP-NOW:
- `typedef struct ... nombre` define un tipo de dato personalizado llamado `struct_message`.
- ESP-NOW serializa esta struct como **bytes en memoria** (sin ningún formato como JSON o XML).
- Por esto, la struct debe ser **idéntica en ambos dispositivos**: mismo orden de campos, mismos tipos de datos. Un campo diferente corrompería todos los datos.
- El tamaño total es 24 bytes (1×4 + 5×4), muy por debajo del límite de 250 bytes de ESP-NOW.

```cpp
struct_message myData;
```
Variable global que almacena los datos a enviar. Es global para no recrearla en cada ciclo del `loop()`.

```cpp
esp_now_peer_info_t peerInfo;
```
Estructura que describe al receptor (peer) en la red ESP-NOW. Contiene la MAC de destino, el canal WiFi y si usa cifrado. Se rellena en `setup()`.

---

### Función `OnDataSent`

```cpp
void OnDataSent(const wifi_tx_info_t *mac_info, esp_now_send_status_t status) {
```
Callback que ESP-NOW llama automáticamente **después de cada `esp_now_send()`**. El parámetro `status` indica si el receptor acusó recibo a nivel de capa MAC (no confirma que el receptor procesó el dato, solo que lo recibió en el aire).

```cpp
  Serial.print("\r\nEstado del último envío: ");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Éxito" : "Fallo");
}
```
Imprime en el Monitor Serial si el envío fue exitoso. El operador ternario `condición ? valor_si_true : valor_si_false` selecciona el texto según el estado.

---

### Función `setup()`

```cpp
void setup() {
  Serial.begin(115200);
```
Inicializa la comunicación serial a 115200 baudios. Esta velocidad debe coincidir con la configurada en el Monitor Serial del Arduino IDE para ver los mensajes de debug.

```cpp
  if (bme.begin(0x76)) {
    Serial.println(F("BME280 detectado."));
    sensorPresente = true;
  } else {
    Serial.println(F("BME280 no encontrado. Datos en 0."));
    sensorPresente = false;
  }
```
`bme.begin(0x76)` intenta inicializar el sensor en la dirección I2C `0x76`. Devuelve `true` si el sensor responde correctamente, `false` si no está conectado o la dirección es incorrecta. La dirección alternativa es `0x77` (cuando el pin SDO del BME280 está conectado a VCC en lugar de GND). La macro `F()` almacena el string en la memoria Flash (PROGMEM) en lugar de RAM, ahorrando memoria en microcontroladores con RAM limitada.

```cpp
  WiFi.mode(WIFI_STA);
```
Configura el módulo WiFi en modo **Station** (cliente). Aunque el emisor no se conecta a ninguna red, ESP-NOW requiere que el hardware WiFi esté activo. `WIFI_STA` consume menos energía que el modo Access Point (`WIFI_AP`).

```cpp
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
```
**Línea crítica.** Fija el canal de radio WiFi en el canal 1. El receptor, al conectarse al router, usará el canal que el router tenga configurado (típicamente 1, 6 u 11). Si emisor y receptor no están en el mismo canal, los paquetes ESP-NOW no llegan. `WIFI_SECOND_CHAN_NONE` desactiva el canal secundario (solo necesario para WiFi de 40MHz, no para ESP-NOW).

```cpp
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error inicializando ESP-NOW");
    return;
  }
```
Inicializa el subsistema ESP-NOW. Si falla (por ejemplo, si el WiFi no está en modo correcto), `esp_now_init()` devuelve un código de error distinto de `ESP_OK`. El `return` en `setup()` detiene la inicialización sin entrar en `loop()`.

```cpp
  esp_now_register_send_cb(OnDataSent);
```
Registra el callback de confirmación de envío. A partir de este momento, cada `esp_now_send()` llamará automáticamente a `OnDataSent` cuando el receptor acuse recibo.

```cpp
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
```
`memcpy(destino, origen, bytes)` copia exactamente 6 bytes de `broadcastAddress` al campo `peer_addr` de la estructura `peerInfo`. El `6` es el tamaño de una MAC — **no confundir con el canal WiFi**. Poner un valor incorrecto aquí enviaría el paquete a una MAC inválida.

```cpp
  peerInfo.channel = 0;
```
Canal del peer. `0` significa "usar el canal WiFi actual del dispositivo" — el que se fijó con `esp_wifi_set_channel()`.

```cpp
  peerInfo.encrypt = false;
```
Desactiva el cifrado ESP-NOW. Activarlo requiere configurar claves PMK y LMK; para un proyecto interno sin datos sensibles, sin cifrado es suficiente.

```cpp
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Fallo al añadir el peer");
    return;
  }
```
Registra al receptor como peer conocido en la tabla interna de ESP-NOW. Sin este paso, `esp_now_send()` con esa MAC fallaría. El `&` pasa la dirección de memoria de `peerInfo`.

---

### Función `loop()`

```cpp
void loop() {
  myData.id = 2;
```
Asigna el identificador de este nodo. Cada ESP32 emisor debe tener un `id` único (1, 2, 3...). El receptor usa este `id` como índice en su arreglo `devicesData[id-1]` y como `nodeId` en la base de datos.

```cpp
  myData.extra_variable = 0.0;
```
Inicializa el campo de expansión. En el futuro podría recibir datos de un sensor NPK, pH, CO2, etc. Por ahora se envía en cero.

```cpp
  if (sensorPresente) {
    myData.temperature = bme.readTemperature();
```
`readTemperature()` lee el registro de temperatura del BME280 y devuelve un `float` en grados Celsius. Internamente aplica la fórmula de compensación del fabricante usando los coeficientes de calibración únicos de cada chip.

```cpp
    myData.humidity = bme.readHumidity();
```
Devuelve la humedad relativa como porcentaje (0–100). El BME280 mide entre 0% y 100% con ±3% de precisión.

```cpp
    myData.pressure = bme.readPressure() / 100.0F;
```
`readPressure()` devuelve Pascales (Pa). Dividir por 100 convierte a **hPa** (hectopascales, equivalentes a milibares). La presión atmosférica normal es ~1013 hPa; el sufijo `F` indica que `100.0` es un `float` y no un `double`, evitando una conversión implícita de tipos.

```cpp
    myData.altitude = bme.readAltitude(SEALEVELPRESSURE_HPA);
```
Calcula la altitud usando la **fórmula barométrica**: compara la presión leída con `SEALEVELPRESSURE_HPA` (1013.25 hPa). El resultado es una aproximación — la altitud barométrica varía con el clima.

```cpp
  } else {
    myData.temperature = 0.0; myData.humidity = 0.0;
    myData.pressure = 0.0; myData.altitude = 0.0;
  }
```
Si el sensor no está disponible, envía ceros. Esto mantiene el sistema funcionando para pruebas de red sin hardware.

```cpp
  Serial.printf("Enviando -> T: %.2f | H: %.2f | P: %.2f\n",
                myData.temperature, myData.humidity, myData.pressure);
```
`printf` formatea el string con `%.2f` (float con 2 decimales). Útil para monitorear en tiempo real desde el Monitor Serial.

```cpp
  esp_err_t result = esp_now_send(broadcastAddress,
                                  (uint8_t *) &myData,
                                  sizeof(myData));
```
Envía el paquete ESP-NOW:
- `broadcastAddress` — MAC del receptor destino.
- `(uint8_t *) &myData` — puntero a los bytes de la struct. El cast `(uint8_t *)` convierte el puntero de `struct_message*` a `uint8_t*` (byte por byte), que es lo que ESP-NOW espera.
- `sizeof(myData)` — calcula automáticamente el tamaño de la struct en bytes (24 bytes). Así no hay que hardcodear el número.

```cpp
  delay(5000);
}
```
Pausa 5 segundos antes del siguiente ciclo. Ajustar según la frecuencia de muestreo requerida.

---

## 5. Arduino — Nodo Receptor (`codigoReciber.ino`)

El receptor combina **dos protocolos simultáneamente**: ESP-NOW (recibir paquetes del emisor) y HTTP (reenviar esos datos al servidor Spring Boot). La versión final usa una **bandera de sincronización** para desacoplar el callback de interrupción del POST HTTP.

### Código completo con explicación línea por línea

```cpp
#include <esp_now.h>
#include <WiFi.h>
#include <HTTPClient.h>
```
`HTTPClient.h` es la librería de Arduino para hacer peticiones HTTP desde el ESP32. Maneja la conexión TCP, el handshake HTTP, el envío de headers y el cuerpo, y la lectura de la respuesta — todo de forma síncrona.

```cpp
#include <ArduinoJson.h>
```
Librería para serializar y deserializar JSON en microcontroladores. Diseñada para evitar el heap dinámico (malloc/free) que es problemático en sistemas con poca RAM.

```cpp
const char* ssid     = "NOMBRE_RED";
const char* password = "CONTRASEÑA";
```
`const char*` es un puntero a una cadena de caracteres constante (no se puede modificar en tiempo de ejecución). Se almacena en Flash en lugar de RAM.

```cpp
const char* serverUrl = "http://192.168.130.32:8080/api/rest/telemetry";
```
URL completa del endpoint POST de Spring Boot. Para despliegue en Render, cambiar por `https://TU-APP.onrender.com/api/rest/telemetry`. La diferencia HTTP vs HTTPS determina si se necesita o no `WiFiClientSecure`.

```cpp
typedef struct struct_message {
  int id;
  float temperature;
  float humidity;
  float pressure;
  float altitude;
  float extra_variable;
} struct_message;
```
**Idéntica** a la del emisor. ESP-NOW copia los bytes en bruto, por lo que cualquier diferencia (cambio de orden, cambio de tipo) corrompe los datos silenciosamente.

```cpp
#define MAX_DEVICES 10
struct_message devicesData[MAX_DEVICES];
```
Arreglo que almacena el último dato recibido de cada nodo. Funciona como una tabla de estado: `devicesData[0]` contiene el último dato del nodo con `id=1`, `devicesData[1]` el del nodo `id=2`, etc. El índice `id-1` evita desperdiciar `devicesData[0]` (los IDs empiezan en 1).

```cpp
volatile int pendingNodeId = -1;
```
**Bandera de sincronización entre el callback de interrupción y el loop principal.** La palabra clave `volatile` le indica al compilador que esta variable puede cambiar en cualquier momento (desde la interrupción) y que no debe optimizarla cacheándola en un registro del procesador. `-1` significa "no hay trabajo pendiente".

---

### Función `POSTRequest`

```cpp
void POSTRequest(String url, String data) {
  HTTPClient http;
```
Crea una instancia del cliente HTTP en el stack. Se destruye automáticamente al salir de la función, liberando los recursos de la conexión TCP.

```cpp
  http.setTimeout(10000);
```
Timeout de 10 segundos. Si el servidor no responde en ese tiempo, la función cancela la petición. Importante para evitar que el ESP32 se quede bloqueado indefinidamente si el servidor está ocupado o caído.

```cpp
  http.begin(url.c_str());
```
Abre la conexión TCP al servidor (handshake TCP de 3 vías). `url.c_str()` convierte el `String` de Arduino a `const char*` que la función espera. Esta línea no envía el HTTP request aún — solo establece la conexión.

```cpp
  http.addHeader("Content-Type", "application/json");
```
Agrega el header HTTP `Content-Type: application/json`. **Crítico**: sin este header, Spring Boot no sabe cómo interpretar el cuerpo y devuelve error 415 (Unsupported Media Type). Jackson (el deserializador JSON de Spring) solo procesa el cuerpo cuando este header está presente.

```cpp
  int httpResponseCode = http.POST(data);
```
Envía el HTTP POST con el cuerpo `data` (el JSON). La función es **bloqueante** — espera hasta recibir la respuesta completa o que expire el timeout. Devuelve el código de estado HTTP (201, 200, 500, etc.) o un código negativo si hay error de red.

```cpp
  Serial.print("Codigo respuesta: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode == 201 || httpResponseCode == 200) {
    String responseBody = http.getString();
    Serial.println("Respuesta: " + responseBody);
  } else {
    Serial.printf("Error en HTTP request: %s\n",
                  http.errorToString(httpResponseCode).c_str());
  }
```
Se aceptan tanto `201` (Created — lo que devuelve el `@PostMapping`) como `200` (OK) para compatibilidad con diferentes versiones del servidor. `http.errorToString()` convierte códigos negativos de error de red a texto legible (por ejemplo, `-1` = "CONNECTION_REFUSED").

```cpp
  http.end();
}
```
**Obligatorio.** Cierra la conexión TCP y libera los buffers de la librería. Sin esta llamada, el ESP32 agota rápidamente los sockets TCP disponibles (el ESP32 tiene un número limitado).

---

### Función `sendToServer`

```cpp
void sendToServer(struct_message& data) {
```
Recibe la struct por **referencia** (`&`). Esto evita copiar los 24 bytes de la struct en el stack — el parámetro apunta directamente al original en `devicesData`.

```cpp
  if (WiFi.status() != WL_CONNECTED) {
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
```
Verifica la conexión WiFi antes de intentar el POST. Si se perdió la conexión (corte de luz, router reiniciado), intenta reconectar hasta 10 veces (5 segundos total). Si no lo logra, abandona el intento con `return` — el dato se pierde, pero el sistema no se bloquea.

```cpp
  StaticJsonDocument<256> doc;
```
Reserva un buffer JSON de 256 bytes en el **stack** (memoria estática). `StaticJsonDocument` es más eficiente que `DynamicJsonDocument` (que usa heap) en microcontroladores. 256 bytes es más que suficiente para los 6 campos del sensor (~120 bytes de JSON).

```cpp
  doc["nodeId"]        = data.id;
  doc["temperature"]   = data.temperature;
  doc["humidity"]      = data.humidity;
  doc["pressure"]      = data.pressure;
  doc["altitude"]      = data.altitude;
  doc["extraVariable"] = data.extra_variable;
```
Asigna valores al documento JSON. Los nombres de las claves (entre comillas) deben coincidir **exactamente** con los nombres de los atributos en `SensorData.java`. Spring Boot usa Jackson para deserializar, que mapea `"nodeId"` al campo `nodeId`, `"temperature"` al campo `temperature`, etc.

```cpp
  String jsonBody;
  serializeJson(doc, jsonBody);
```
`serializeJson` convierte el `StaticJsonDocument` a una cadena de texto JSON y la escribe en `jsonBody`. El resultado es algo como: `{"nodeId":2,"temperature":24.5,"humidity":63.0,"pressure":1012.8,"altitude":1534.2,"extraVariable":0.0}`.

```cpp
  POSTRequest(String(serverUrl), jsonBody);
}
```
Llama a la función de envío con la URL y el cuerpo JSON.

---

### Callback `OnDataRecv`

```cpp
void OnDataRecv(const esp_now_recv_info_t *info, const uint8_t *incomingData, int len) {
```
Callback de recepción ESP-NOW. Se ejecuta en el contexto de una **tarea de interrupción WiFi** (IRAM). Esto significa que se corre en el stack del sistema operativo de FreeRTOS, no en el stack del `loop()`. Por eso **no es seguro hacer operaciones lentas aquí** (como HTTP POST).

```cpp
  char macStr[18];
  snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
           info->src_addr[0], info->src_addr[1], info->src_addr[2],
           info->src_addr[3], info->src_addr[4], info->src_addr[5]);
```
Formatea la MAC del emisor como string legible (ej: `44:1d:64:f3:c8:e8`). `%02x` imprime cada byte como hexadecimal con mínimo 2 dígitos y ceros a la izquierda. `sizeof(macStr)` = 18 (17 caracteres de MAC + null terminator).

```cpp
  struct_message receivedData;
  memcpy(&receivedData, incomingData, sizeof(receivedData));
```
Copia los bytes recibidos por ESP-NOW a la struct local. `incomingData` es un puntero a los bytes en bruto del paquete. `memcpy` los interpreta como si fueran una `struct_message` — por eso la struct debe ser idéntica en ambos dispositivos.

```cpp
  if (receivedData.id >= 1 && receivedData.id <= MAX_DEVICES) {
    devicesData[receivedData.id - 1] = receivedData;
```
Valida el ID antes de usarlo como índice. Sin esta validación, un `id=0` causaría `devicesData[-1]` (acceso fuera de límites = corrupción de memoria). El `-1` convierte el ID base-1 (1,2,3...) a índice base-0 (0,1,2...).

```cpp
    Serial.printf("\n[Rx] ID:%d T:%.2f H:%.2f P:%.2f Alt:%.2f\n",
                  receivedData.id, receivedData.temperature,
                  receivedData.humidity, receivedData.pressure,
                  receivedData.altitude);

    pendingNodeId = receivedData.id;
```
**La clave de la arquitectura final.** En lugar de llamar `sendToServer()` aquí (que tomaría varios segundos bloqueando la tarea de interrupción), simplemente guarda el `id` en la variable `volatile`. El `loop()` lo procesará en la siguiente iteración.

---

### Función `setup()`

```cpp
void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConectado!");
  Serial.println(WiFi.localIP());
```
A diferencia del emisor, el receptor **sí se conecta a WiFi**. `WiFi.localIP()` imprime la IP asignada por el router — útil para saber qué IP tiene en la red local.

```cpp
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error ESP-NOW");
    return;
  }
  esp_now_register_recv_cb(OnDataRecv);
```
Inicializa ESP-NOW y registra el callback de recepción. El receptor no necesita registrar peers — puede recibir de cualquier emisor ESP-NOW que envíe a su MAC.

```cpp
  for (int i = 0; i < MAX_DEVICES; i++) devicesData[i].id = 0;
```
Inicializa todos los slots del arreglo con `id=0`. El `id=0` es el centinela que indica "no se ha recibido ningún paquete de este nodo todavía". Los IDs válidos empiezan en 1.

---

### Función `loop()`

```cpp
void loop() {
  if (pendingNodeId != -1) {
    int id = pendingNodeId;
    pendingNodeId = -1;
    sendToServer(devicesData[id - 1]);
  }
  delay(10);
}
```
**Patrón productor-consumidor simplificado:**
- El callback `OnDataRecv` es el **productor**: recibe el dato y levanta la bandera.
- El `loop()` es el **consumidor**: revisa la bandera y procesa el dato cuando es seguro hacerlo.
- `int id = pendingNodeId; pendingNodeId = -1;` — guarda el ID y baja la bandera antes de llamar a `sendToServer`, evitando que un nuevo paquete se pierda durante el POST.
- `delay(10)` — pausa de 10ms para no saturar el CPU y dar tiempo al sistema WiFi de procesar sus propias tareas internas.

---

## 6. Java — `SensoresApplication.java`

```java
package com.example.sensores;
```
Declara el paquete Java. Todos los archivos bajo `src/main/java/com/example/sensores/` pertenecen a este paquete o sus subpaquetes.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
```
Importa las clases necesarias del framework Spring Boot.

```java
@SpringBootApplication
public class SensoresApplication {
```
`@SpringBootApplication` es una anotación compuesta que equivale a tres anotaciones juntas:
- `@Configuration` — marca la clase como fuente de beans de Spring.
- `@EnableAutoConfiguration` — activa la autoconfiguración de Spring Boot (detecta las dependencias en el classpath y configura automáticamente Hibernate, Tomcat, Jackson, etc.).
- `@ComponentScan` — escanea el paquete actual y todos sus subpaquetes buscando `@Component`, `@Service`, `@Repository`, `@Controller`, etc.

```java
    public static void main(String[] args) {
        SpringApplication.run(SensoresApplication.class, args);
    }
}
```
Punto de entrada de la aplicación Java. `SpringApplication.run()` arranca el contexto de Spring, inicializa todos los beans, lanza el servidor Tomcat embebido en el puerto 8080, y conecta con la base de datos.

---

## 7. Java — `ServletInitializer.java`

```java
public class ServletInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SensoresApplication.class);
    }
}
```
Permite que la aplicación se despliegue como un **WAR** en un servidor de aplicaciones externo (Tomcat, WildFly) además de como JAR autocontenido. En este proyecto se usa como JAR con Tomcat embebido, por lo que esta clase no tiene efecto en el despliegue en Render. Se incluye por compatibilidad.

---

## 8. Java — `SensorData.java` (Modelo)

La entidad JPA que representa una fila de la tabla `sensor_data` en PostgreSQL.

```java
package com.example.sensores.model;
```
Subpaquete `model`. Por convención, las entidades JPA van aquí.

```java
import jakarta.persistence.*;
```
Importa las anotaciones de **Jakarta Persistence API** (antes javax.persistence). Son el estándar Java para ORM — no son específicas de Hibernate, sino parte de la especificación que Hibernate implementa.

```java
import lombok.Data;
import lombok.NoArgsConstructor;
```
Lombok es un procesador de anotaciones que genera código en tiempo de compilación.

```java
@Data
```
Genera automáticamente: `getters` para todos los campos, `setters` para todos los campos no-final, `toString()`, `equals()`, `hashCode()`, y un constructor con todos los campos requeridos. Sin Lombok, serían ~60 líneas de código repetitivo.

```java
@NoArgsConstructor
```
Genera un constructor sin argumentos: `public SensorData() {}`. JPA **requiere obligatoriamente** un constructor sin argumentos para poder instanciar entidades al cargarlas desde la base de datos usando reflexión.

```java
@Entity(name = "SensorData")
public class SensorData {
```
`@Entity` marca la clase como entidad JPA — Hibernate la mapeará a una tabla en PostgreSQL. El parámetro `name = "SensorData"` es el nombre de la entidad en las consultas JPQL (no el nombre de la tabla SQL). Hibernate convierte `SensorData` a `sensor_data` como nombre de tabla (snake_case automático).

```java
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
```
- `@Id` — clave primaria de la tabla.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — delega la generación del ID a la base de datos. PostgreSQL usa `SERIAL` o `GENERATED ALWAYS AS IDENTITY` — un contador autoincremental. Cada INSERT automáticamente recibe el siguiente número disponible.
- `Integer` (wrapper) en lugar de `int` (primitivo) permite representar `NULL` en la base de datos cuando el campo no tiene valor.

```java
    @Column(name = "node_id")
    private Integer nodeId;
```
`@Column(name = "node_id")` mapea el campo `nodeId` (camelCase Java) a la columna `node_id` (snake_case SQL). Sin esta anotación, Hibernate generaría la columna como `node_id` igualmente (convención automática), pero se declara explícitamente para mayor claridad y control.

```java
    private Float temperature;
    private Float humidity;
    private Float pressure;
    private Float altitude;
```
Sin `@Column`, Hibernate genera columnas con el mismo nombre que el campo en minúsculas: `temperature`, `humidity`, `pressure`, `altitude`. `Float` wrapper permite NULL; `float` primitivo no puede ser NULL en Java.

```java
    @Column(name = "extra_variable")
    private Float extraVariable;
```
Mapea `extraVariable` a la columna `extra_variable`. Necesario porque sin la anotación Hibernate generaría `extravariable` (todo en minúsculas).

```java
    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;
```
- `name = "timestamp"` — nombre de la columna en PostgreSQL.
- `updatable = false` — Hibernate no incluirá esta columna en los UPDATE SQL. Es de solo escritura inicial — protege el timestamp original de recepción.
- `LocalDateTime` representa fecha y hora sin zona horaria. Hibernate lo mapea a `TIMESTAMP` en PostgreSQL.

```java
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
```
`@PrePersist` registra este método como **lifecycle callback de JPA**. Hibernate lo ejecuta automáticamente **justo antes de ejecutar el INSERT SQL**, independientemente de si el campo `timestamp` ya tiene un valor o no. `LocalDateTime.now()` captura el momento exacto en el servidor — garantiza que el timestamp refleja cuándo llegó el dato al servidor, no cuándo lo envió el ESP32.

---

## 9. Java — `SensorDataRepository` (Repositorio)

```java
@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {
```
- `@Repository` — marca como componente de acceso a datos. Spring la detecta en el escaneo y la registra como bean.
- `interface` — no `class`. No se escribe ninguna implementación.
- `extends JpaRepository<SensorData, Integer>` — hereda automáticamente todos los métodos CRUD: `save()`, `findAll()`, `findById()`, `deleteById()`, `count()`, etc. `SensorData` es el tipo de entidad, `Integer` es el tipo del ID.

Spring Data JPA en tiempo de arranque **genera automáticamente las implementaciones** de todos los métodos basándose en sus nombres. Esta es la "magia" de Spring Data:

```java
    @Query("SELECT DISTINCT s.nodeId FROM SensorData s")
    List<Integer> findDistinctNodeIds();
```
`@Query` con JPQL (no SQL). `SensorData` es el nombre de la entidad Java, `s` es el alias, `s.nodeId` es el campo Java. Hibernate traduce esto a: `SELECT DISTINCT node_id FROM sensor_data`.

### Métodos por convención de nombres (Query Method DSL)

Spring Data parsea los nombres de los métodos y genera las queries correspondientes:

| Método Java | SQL generado |
|---|---|
| `findByNodeId(Integer nodeId)` | `SELECT * FROM sensor_data WHERE node_id = ?` |
| `findByTemperatureGreaterThan(Float t)` | `SELECT * FROM sensor_data WHERE temperature > ?` |
| `findByTemperatureLessThan(Float t)` | `SELECT * FROM sensor_data WHERE temperature < ?` |
| `findByHumidityGreaterThan(Float h)` | `SELECT * FROM sensor_data WHERE humidity > ?` |
| `findByTimestampBetween(start, end)` | `SELECT * FROM sensor_data WHERE timestamp BETWEEN ? AND ?` |
| `findByTimestampAfter(date)` | `SELECT * FROM sensor_data WHERE timestamp > ?` |
| `findByTimestampBefore(date)` | `SELECT * FROM sensor_data WHERE timestamp < ?` |
| `findByNodeIdAndTimestampBetween(...)` | `SELECT * FROM ... WHERE node_id=? AND timestamp BETWEEN ? AND ?` |
| `findByNodeIdOrderByTimestampDesc(id)` | `SELECT * FROM ... WHERE node_id=? ORDER BY timestamp DESC` |
| `findFirstByNodeIdOrderByTimestampDesc(id)` | `... ORDER BY timestamp DESC LIMIT 1` |
| `findTop10ByNodeIdOrderByTimestampDesc(id)` | `... ORDER BY timestamp DESC LIMIT 10` |
| `findFirstByOrderByTimestampDesc()` | `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1` |

**Reglas del DSL:**
- `findBy` → WHERE
- `And` / `Or` → AND / OR
- `GreaterThan` → >
- `LessThan` → <
- `Between` → BETWEEN
- `After` → >  (para fechas)
- `Before` → < (para fechas)
- `OrderByXxxDesc/Asc` → ORDER BY
- `findFirst` / `findTop10` → LIMIT 1 / LIMIT 10

---

## 10. Java — `SensorService.java` (Interfaz de servicio)

```java
public interface SensorService {
    Iterable<SensorData> findAll();
    SensorData save(SensorData sensorData);
    List<Integer> findDistinctNodeIds();
    // ... todos los métodos de búsqueda
}
```

**Por qué una interfaz y no directamente la implementación:**
- Los controladores dependen de `SensorService` (la interfaz), no de `SensorServiceImp` (la implementación concreta).
- Si en el futuro se cambia la implementación (por ejemplo, añadir caché, cambiar la BD), los controladores no necesitan modificarse.
- Facilita las pruebas unitarias — se puede crear una implementación mock de `SensorService` para testear los controladores sin necesitar una BD real.
- Es el principio de **inversión de dependencias** (la D de SOLID).

Todos los métodos del repositorio se espejean aquí para que los controladores puedan llamarlos a través del servicio, manteniendo la separación de capas.

---

## 11. Java — `SensorServiceImp.java` (Implementación)

```java
@Service
@RequiredArgsConstructor
public class SensorServiceImp implements SensorService {
```
- `@Service` — marca como componente de lógica de negocio. Spring lo detecta y lo registra como bean. Cuando un controlador declara `private final SensorService`, Spring inyecta esta implementación automáticamente.
- `@RequiredArgsConstructor` (Lombok) — genera el constructor: `public SensorServiceImp(SensorDataRepository repo) { this.sensorDataRepository = repo; }`. Spring usa este constructor para inyectar el repositorio (inyección por constructor — la forma recomendada por encima de `@Autowired`).

```java
    private final SensorDataRepository sensorDataRepository;
```
`final` garantiza que la referencia no puede cambiarse después de la construcción. Hace la clase inmutable respecto a sus dependencias.

```java
    @Override
    public SensorData save(SensorData sensorData) {
        return sensorDataRepository.save(sensorData);
    }
```
Delega directamente al repositorio. `JpaRepository.save()` detecta automáticamente si debe hacer INSERT (si el ID es null) o UPDATE (si el ID ya existe).

Todos los demás métodos siguen el mismo patrón de delegación directa al repositorio. En proyectos más complejos, aquí iría lógica de negocio: validaciones, transformaciones de datos, envío de notificaciones, integración con otros servicios, etc.

---

## 12. Java — `SensorRestController.java` (API REST)

```java
@RestController
@RequestMapping("/api/rest/telemetry")
@RequiredArgsConstructor
public class SensorRestController {
```
- `@RestController` — combina `@Controller` (detecta la clase como controlador web) y `@ResponseBody` (serializa automáticamente los objetos de retorno a JSON usando Jackson). Sin `@ResponseBody`, Spring buscaría una vista Thymeleaf con el nombre del String devuelto.
- `@RequestMapping("/api/rest/telemetry")` — todas las rutas de esta clase tienen este prefijo. Equivale a una URL base.
- `@RequiredArgsConstructor` — genera constructor que inyecta `SensorService`.

```java
    private final SensorService sensorService;
```
Dependencia inyectada. `final` + constructor = inyección por constructor. Spring detecta que `SensorServiceImp` implementa `SensorService` y la inyecta aquí.

---

### Método `receiveTelemetry` — POST

```java
    @PostMapping
    public ResponseEntity<String> receiveTelemetry(@RequestBody SensorData sensorData) {
```
- `@PostMapping` — mapea peticiones `POST /api/rest/telemetry`.
- `@RequestBody SensorData sensorData` — Jackson lee el cuerpo JSON del request y lo deserializa al objeto Java. El campo JSON `"nodeId"` mapea al atributo Java `nodeId`, etc.
- `ResponseEntity<String>` — permite controlar código HTTP + headers + cuerpo de la respuesta. `<String>` es el tipo del cuerpo.

```java
        try {
            if (sensorData.getTimestamp() == null) {
                sensorData.setTimestamp(LocalDateTime.now());
            }
```
Doble protección para el timestamp. El `@PrePersist` ya lo asigna, pero si por alguna razón llega con timestamp del cliente, se reemplaza con el del servidor.

```java
            sensorService.save(sensorData);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Datos guardados correctamente");
```
`HttpStatus.CREATED` es el código 201 — semánticamente correcto para recursos creados exitosamente. El ESP32 receptor valida este código (`httpResponseCode == 201`) para confirmar que el dato se guardó.

```java
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar: " + e.getMessage());
        }
```
Captura cualquier excepción (error de conexión a BD, violación de restricción, etc.) y devuelve 500 con el mensaje de error. El ESP32 lo verá como un código diferente de 201 e imprimirá el error.

---

### Método `getAllData` — GET todos

```java
    @GetMapping
    public ResponseEntity<Iterable<SensorData>> getAllData() {
        return ResponseEntity.ok(sensorService.findAll());
    }
```
`@GetMapping` sin path mapea `GET /api/rest/telemetry`. `ResponseEntity.ok()` es un shortcut para `ResponseEntity.status(200).body(...)`. Jackson serializa el `Iterable<SensorData>` como un array JSON.

---

### Método `getLast10` — GET últimos 10

```java
    @GetMapping("/last10/{nodeId}")
    public ResponseEntity<List<SensorData>> getLast10(@PathVariable Integer nodeId) {
        return ResponseEntity.ok(
            sensorService.findTop10ByNodeIdOrderByTimestampDesc(nodeId));
    }
```
- `{nodeId}` — variable de path. En la URL `/last10/2`, Spring extrae `"2"` y lo convierte a `Integer`.
- `@PathVariable Integer nodeId` — enlaza la variable de la URL con el parámetro del método.
- Este endpoint es el que llama el dashboard JavaScript con `fetch()`.

---

### Método `getLastData` — GET último de un nodo

```java
    @GetMapping("/last/{nodeId}")
    public ResponseEntity<SensorData> getLastData(@PathVariable Integer nodeId) {
        SensorData data = sensorService.findFirstByNodeIdOrderByTimestampDesc(nodeId);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }
```
Cuando no hay datos para el nodo, devuelve `404 Not Found` en lugar de serializar `null` (que produciría un JSON `null` confuso). `.build()` crea el `ResponseEntity` sin cuerpo.

---

## 13. Java — `SensorMvcController.java` (Vistas web)

```java
@Controller
@RequestMapping("/mvc/telemetry")
@RequiredArgsConstructor
public class SensorMvcController {
```
`@Controller` (sin `@Rest`) — los métodos devuelven **nombres de plantillas** Thymeleaf, no datos JSON. Spring resuelve el nombre a un archivo en `src/main/resources/templates/`.

---

### Método `showDashboard`

```java
    @GetMapping
    public String showDashboard(Model model) {
        model.addAttribute("nodes", sensorService.findDistinctNodeIds());
        return "telemetry/dashboard";
    }
```
- `Model model` — Spring inyecta este objeto en el método. Es el contenedor que pasa datos del controlador a la vista.
- `model.addAttribute("nodes", ...)` — añade la lista de IDs con la clave `"nodes"`. En la plantilla Thymeleaf se accede con `${nodes}`.
- `return "telemetry/dashboard"` — Spring busca el archivo `src/main/resources/templates/telemetry/dashboard.html` y lo renderiza con los datos del modelo.

---

### Método `getDataForGraph`

```java
    @GetMapping("/data")
    public String getDataForGraph(@RequestParam Integer nodeId, Model model) {
        var data = sensorService.findTop10ByNodeIdOrderByTimestampDesc(nodeId);
        model.addAttribute("nodeId", nodeId);
        model.addAttribute("data", data);
        return "telemetry/data-fragment";
    }
```
- `@RequestParam Integer nodeId` — lee el parámetro de query string: `/mvc/telemetry/data?nodeId=1`. Spring convierte automáticamente el String `"1"` al `Integer 1`.
- `var` — inferencia de tipos de Java 10+. El compilador infiere que `data` es `List<SensorData>`.
- Devuelve `"telemetry/data-fragment"` — el archivo `data-fragment.html`, renderizado con los datos del nodo.

---

## 14. Thymeleaf — `dashboard.html`

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
```
`xmlns:th` declara el namespace de Thymeleaf. Permite usar atributos `th:*` en el HTML sin que los validadores HTML los rechacen. En tiempo de render del servidor, Thymeleaf procesa estos atributos y genera HTML estático limpio.

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```
Importa Chart.js desde CDN. El archivo se carga en el navegador del cliente — no en el servidor. No requiere dependencia en `pom.xml`.

```html
<select id="nodeSelect">
    <option th:each="node : ${nodes}"
            th:value="${node}"
            th:text="${node}">
    </option>
</select>
```
- `th:each="node : ${nodes}"` — itera sobre la lista `nodes` del modelo. Por cada elemento genera un `<option>`. Equivale a un `for(Integer node : nodes)` en Java.
- `th:value="${node}"` — reemplaza el atributo `value` del option con el ID del nodo.
- `th:text="${node}"` — reemplaza el texto visible del option con el ID del nodo.

```html
<button onclick="loadData()">Cargar gráfica</button>
```
Botón que llama a la función JavaScript `loadData()` al hacer clic. Esta función hace un `fetch()` al endpoint REST.

```javascript
function loadData() {
    const nodeId = document.getElementById('nodeSelect').value;
    if (!nodeId) return;

    fetch(`/api/rest/telemetry/last10/${nodeId}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(d => d.timestamp);
            const temps  = data.map(d => d.temperature);
            const hums   = data.map(d => d.humidity);
```
`fetch()` es la API moderna del navegador para hacer peticiones HTTP. La URL usa template literals (backticks) para insertar el valor del select dinámicamente. `.then(response => response.json())` deserializa el JSON de la respuesta. `.map()` extrae arrays de un campo específico de cada objeto.

```javascript
            if (chart) chart.destroy();
            const ctx = document.getElementById('sensorChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Temperatura (°C)', data: temps,
                          borderColor: 'red', fill: false },
                        { label: 'Humedad (%)', data: hums,
                          borderColor: 'blue', fill: false }
                    ]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            });
```
`chart.destroy()` elimina la gráfica anterior antes de crear una nueva — evita que Chart.js acumule instancias en memoria. `new Chart(ctx, config)` crea una gráfica de líneas con dos datasets: temperatura (rojo) y humedad (azul). `responsive: true` hace la gráfica adaptable al tamaño del contenedor.

---

## 15. Thymeleaf — `data-fragment.html`

```html
<div th:fragment="recentData">
```
`th:fragment="recentData"` declara este div como un fragmento reutilizable. Otros templates pueden incluirlo con `th:replace="~{telemetry/data-fragment :: recentData}"`. Permite reutilizar componentes HTML entre vistas.

```html
    <h3>Últimas 10 lecturas del Nodo
        <span th:text="${nodeId}"></span>
    </h3>
```
`th:text="${nodeId}"` reemplaza el contenido del `<span>` con el valor de `nodeId` del modelo (pasado por `SensorMvcController.getDataForGraph()`).

```html
    <tr th:each="d : ${data}">
        <td th:text="${#temporals.format(d.timestamp,
                      'dd/MM/yyyy HH:mm:ss')}">
        </td>
        <td th:text="${d.temperature}"></td>
        <td th:text="${d.humidity}"></td>
    </tr>
```
- `th:each="d : ${data}"` — genera una `<tr>` por cada `SensorData` en la lista.
- `${#temporals.format(...)}` — utilitario de Thymeleaf para formatear `LocalDateTime`. `#temporals` es un objeto de utilidad disponible globalmente en todas las plantillas. El formato `'dd/MM/yyyy HH:mm:ss'` produce algo como `10/04/2026 14:32:15`.

---

## 16. Configuración — `application.properties`

```properties
spring.application.name=sensores
```
Nombre lógico de la aplicación. Aparece en los logs de Spring Boot.

```properties
spring.datasource.url=jdbc:postgresql://host/neondb?sslmode=require
spring.datasource.username=neondb_owner
spring.datasource.password=TU_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver
```
- `jdbc:postgresql://` — protocolo JDBC para PostgreSQL.
- `?sslmode=require` — Neon exige conexiones SSL. Sin esto, la conexión es rechazada.
- `driver-class-name` — clase Java del driver JDBC de PostgreSQL. Spring Boot la detecta automáticamente si `postgresql` está en el classpath, pero se declara explícitamente para mayor claridad.

> **Seguridad:** En producción, las credenciales deben definirse como variables de entorno en Render, no en el archivo de propiedades commiteado al repositorio.

```properties
spring.jpa.hibernate.ddl-auto=update
```
Controla qué hace Hibernate con el esquema de BD al arrancar:
- `update` — compara el esquema existente con las entidades Java y aplica los cambios necesarios (añade columnas, crea tablas). **No elimina** columnas existentes.
- `create` — elimina y recrea las tablas cada vez (pierde datos).
- `validate` — valida que el esquema coincida pero no hace cambios (recomendado en producción).
- `none` — no hace nada.

```properties
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```
Indica a Hibernate qué variante de SQL generar. PostgreSQL tiene sintaxis específica para ciertas operaciones (tipos de datos, secuencias, etc.) que difieren de MySQL u Oracle.

```properties
spring.jpa.show-sql=true
```
Imprime cada query SQL en la consola. Muy útil en desarrollo para verificar qué queries genera Hibernate. **Desactivar en producción** — genera mucho ruido en los logs.

---

## 17. Despliegue — `Dockerfile`

```dockerfile
FROM maven:4.0.0-rc-5-eclipse-temurin-17 AS build
```
**Etapa 1: compilación.** Usa la imagen oficial de Maven con JDK 17 (Eclipse Temurin). El alias `AS build` permite referenciar esta etapa desde la siguiente. Esta imagen pesa ~500MB pero solo se usa durante el build — no en producción.

```dockerfile
WORKDIR /app
```
Establece `/app` como directorio de trabajo. Los comandos siguientes se ejecutan relativos a este directorio.

```dockerfile
COPY pom.xml .
COPY src ./src
```
Se copia primero el `pom.xml` y luego el código fuente. **Optimización de caché de Docker**: si el `pom.xml` no cambió entre builds, Docker reutiliza la capa de descarga de dependencias Maven sin re-descargarlas. Solo si el POM cambia se re-descargan las dependencias (que puede tomar minutos).

```dockerfile
RUN mvn clean package -DskipTests
```
Compila el proyecto y genera el JAR en `/app/target/`. `-DskipTests` omite las pruebas para acelerar el build en Render (las pruebas deberían correr en CI/CD, no en el build de producción).

```dockerfile
FROM eclipse-temurin:17-jre-alpine
```
**Etapa 2: ejecución.** Imagen Alpine con solo el JRE (Java Runtime Environment) — sin compilador ni herramientas de build. Pesa ~80MB vs ~500MB del JDK completo. `--from=build` en el siguiente paso copia el JAR desde la etapa anterior.

```dockerfile
WORKDIR /app
COPY --from=build /app/target/sensores-0.0.1-SNAPSHOT.jar app.jar
```
Copia únicamente el JAR final. La imagen resultante no contiene código fuente, Maven, ni el JDK — solo el runtime y el JAR compilado.

```dockerfile
EXPOSE 8080
```
Documenta que el contenedor escucha en el puerto 8080. Render usa esta información para enrutar el tráfico externo.

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```
Comando de inicio del contenedor. Formato JSON (array) — recomendado sobre el formato shell porque no crea un proceso intermedio `/bin/sh`. Spring Boot arranca con el JAR autocontenido que incluye Tomcat embebido.

---

## 18. Dependencias — `pom.xml`

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
</parent>
```
Hereda la configuración del parent POM de Spring Boot. Define versiones compatibles de todas las dependencias (BOM — Bill of Materials), configuración del compilador, y plugins de Maven. Por esto las dependencias `spring-boot-starter-*` no necesitan `<version>` explícita.

```xml
<packaging>jar</packaging>
```
Empaqueta como JAR ejecutable (con Tomcat embebido). El Dockerfile copia este JAR directamente.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
Incluye: Spring MVC (controladores REST y MVC), Tomcat embebido, Jackson (serialización JSON), y todas sus dependencias transitivas. Es el starter que habilita `@RestController`, `@GetMapping`, `@PostMapping`, etc.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
Incluye: Spring Data JPA, Hibernate ORM, y la configuración automática de `EntityManagerFactory`. Habilita `JpaRepository`, `@Entity`, `@Id`, `@Column`, y la generación automática de queries por nombre de método.

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```
Base de datos en memoria H2. `scope=runtime` significa que se incluye en el classpath de ejecución pero no de compilación. Útil para pruebas locales sin PostgreSQL. Spring Boot autoconfigura H2 automáticamente si no hay otra BD configurada.

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```
Driver JDBC de PostgreSQL. `scope=runtime` — necesario en ejecución pero no en compilación (el código Java usa las interfaces JDBC estándar, no clases específicas de PostgreSQL).

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```
Procesador de anotaciones Lombok. `optional=true` — no se propaga como dependencia transitiva a proyectos que dependan de este. El plugin Maven excluye Lombok del JAR final (es solo necesario en compilación).

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```
Motor de plantillas Thymeleaf. Habilita el renderizado de archivos `.html` en `src/main/resources/templates/` con expresiones `th:*`. Spring Boot autoconfigura el `TemplateResolver` automáticamente.

---

## 19. Endpoints disponibles

| Método | URL | Descripción | Cuerpo | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/rest/telemetry` | Recibir datos del ESP32 | JSON SensorData | 201 "Datos guardados" |
| `GET` | `/api/rest/telemetry` | Todos los registros | — | 200 + JSON array |
| `GET` | `/api/rest/telemetry/last/{nodeId}` | Último dato del nodo | — | 200 + JSON objeto / 404 |
| `GET` | `/api/rest/telemetry/last10/{nodeId}` | Últimos 10 del nodo | — | 200 + JSON array |
| `GET` | `/mvc/telemetry` | Dashboard HTML | — | HTML renderizado |
| `GET` | `/mvc/telemetry/data?nodeId=1` | Tabla HTML de datos | — | HTML fragmento |

**Ejemplo de payload POST desde el ESP32:**
```json
{
  "nodeId": 2,
  "temperature": 24.50,
  "humidity": 65.30,
  "pressure": 1012.80,
  "altitude": 1534.20,
  "extraVariable": 0.0
}
```

**Prueba con curl:**
```bash
curl -X POST http://localhost:8080/api/rest/telemetry \
  -H "Content-Type: application/json" \
  -d '{"nodeId":2,"temperature":24.5,"humidity":65.3,"pressure":1012.8,"altitude":1534.2,"extraVariable":0.0}'
```

---

## 20. Cómo correr el proyecto localmente

### Requisitos previos

- Java 17+
- Maven 3.9+ (o usar el wrapper incluido `./mvnw`)
- Arduino IDE 2.x con las librerías:
  - `Adafruit BME280` (instalar desde Library Manager)
  - `ArduinoJson` versión 6.x (instalar desde Library Manager)
  - Board `esp32` de Espressif (instalar desde Board Manager)

### Backend Spring Boot

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tu-repo.git
cd aplicacionJava/sensores

# Ejecutar (se conecta a Neon PostgreSQL según application.properties)
./mvnw spring-boot:run

# La app arranca en http://localhost:8080
# Ver dashboard: http://localhost:8080/mvc/telemetry
# Ver datos JSON: http://localhost:8080/api/rest/telemetry
```

### ESP32 Receptor en modo local

En `codigoReciber.ino`, cambiar la URL al IP de tu PC en la misma red WiFi:
```cpp
const char* serverUrl = "http://192.168.X.X:8080/api/rest/telemetry";
```

Abrir el puerto 8080 en el firewall de Windows (ejecutar como administrador):
```powershell
New-NetFirewallRule -DisplayName "Spring Boot 8080" `
  -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

**Verificar que PC y ESP32 están en la misma red WiFi** — la IP del ESP32 y la de la PC deben estar en el mismo rango (ej: ambas en `192.168.1.x`).

### ESP32 Emisor

Cambiar en `codigoSender.ino`:
```cpp
uint8_t broadcastAddress[] = {0x44, 0x1D, 0x64, 0xF3, 0xC8, 0xE8}; // MAC del receptor
esp_wifi_set_channel(X, WIFI_SECOND_CHAN_NONE); // canal WiFi del router
```
El canal del router lo muestra el receptor en el Monitor Serial al conectarse: `Canal WiFi: X`.

### Despliegue en Render

1. Conectar el repositorio GitHub a Render.
2. Crear un nuevo servicio Web.
3. Seleccionar **Docker** como entorno de build.
4. Configurar **Root Directory** como `aplicacionJava/sensores`.
5. En el ESP32 receptor, cambiar la URL a la URL de Render:
```cpp
const char* serverUrl = "https://TU-APP.onrender.com/api/rest/telemetry";


```

### MQTT

para pausar un nodo en especifico:

Invoke-RestMethod -Uri "http://localhost:8081/api/commands/node/1/pause" -Method POST

para reanudar captura de datos :

 Invoke-RestMethod -Uri "http://localhost:8081/api/commands/node/1/resume" -Method POST

implementación de comandos MQTT para controlar los ESP32
Esta sección describe cómo se añadió la capacidad de enviar comandos PAUSE y RESUME a los ESP32 receptores a través de MQTT, permitiendo detener o reanudar el envío de datos al servidor Spring Boot de forma remota.

1. Arquitectura general
Broker MQTT: se añadió un contenedor Docker con Eclipse Mosquitto.

Spring Boot: se creó un servicio MqttCommandService que publica comandos en el broker.

ESP32 receptor: se suscribe a un tópico MQTT y escucha órdenes. Al recibir PAUSE detiene el envío de datos por HTTP; con RESUME lo reanuda.

2. Configuración del broker MQTT (Mosquitto) en docker-compose.yml

mosquitto:
  image: eclipse-mosquitto:2
  container_name: sensores-mosquitto
  ports:
    - "1883:1883"
  networks:
    - app-network
  volumes:
    - mosquitto_data:/mosquitto/data
    - mosquitto_log:/mosquitto/log

volumes:
  mosquitto_data:
  mosquitto_log:

El broker es accesible dentro de la red Docker como mosquitto:1883.

Desde el host (PC) se puede acceder mediante localhost:1883.

3. Configuración de Spring Boot para publicar comandos MQTT
a. Dependencias en pom.xml

    <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-integration</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.integration</groupId>
            <artifactId>spring-integration-mqtt</artifactId>
        </dependency>

b. Propiedades en application.properties (usando placeholders)
mqtt.broker.url=${MQTT_BROKER_URL:tcp://localhost:1883}
mqtt.client.id=${MQTT_CLIENT_ID:spring-boot-sensores}
mqtt.topic.commands=${MQTT_COMMAND_TOPIC:sensores/commands}

c. Servicio MqttCommandService
@Service
public class MqttCommandService {
    // Inyecta las propiedades y crea un cliente MQTT
    // Método sendCommand(Integer nodeId, String command)
    // Publica en tópico "sensores/commands/{nodeId}" o "sensores/commands/all"
}

d. Controlador REST (CommandController)
@RestController
@RequestMapping("/api/commands")
public class CommandController {
    @PostMapping("/node/{nodeId}/{action}")   // action = pause / resume
    @PostMapping("/all/{action}")
}

Los endpoints reciben peticiones POST y traducen la acción a los comandos PAUSE o RESUME.

Internamente llaman a MqttCommandService.sendCommand().

4. Modificaciones en el código del ESP32 receptor
a. Librerías añadidas
#include <PubSubClient.h>
#include <WiFiClient.h>

b. Variables globales
const char* mqtt_server = "172.30.150.214";   // IP del broker (la de tu PC o la del contenedor)
const int mqtt_port = 1883;
const char* mqtt_topic_sub = "sensores/commands/1";   // tópico para este receptor
WiFiClient espClient;
PubSubClient mqttClient(espClient);
bool enviarDatosHabilitado = true;   // bandera de pausa/reanudación

c. Callback MQTT
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) message += (char)payload[i];
  if (message == "PAUSE") enviarDatosHabilitado = false;
  else if (message == "RESUME") enviarDatosHabilitado = true;
}

d. Conexión y suscripción en setup()
mqttClient.setServer(mqtt_server, mqtt_port);
mqttClient.setCallback(mqttCallback);

Y una función reconnectMQTT() que se llama en el loop() para mantener la conexión.

e. Modificación de sendToServer()
Se añadió un parámetro bool esInactividad = false y una condición inicial:
if (!esInactividad && !enviarDatosHabilitado) {
    Serial.println("Envío pausado por MQTT - datos descartados");
    return;
}

Los mensajes normales (enviarDatosHabilitado = false) no se envían.

Las alertas por inactividad de un nodo esclavo (esInactividad = true) siempre se envían, independientemente de la pausa.

f. Llamadas a sendToServer actualizadas
Para datos normales: sendToServer(devicesData[id-1], "activo", false);

Para inactividad: sendToServer(offData, "inactivo", true);

5. Comunicación del ESP32 con el broker MQTT
El ESP32 se conecta a la misma red WiFi que el broker.

La IP del broker es la de la máquina que ejecuta Docker (por ejemplo 172.30.150.214), el puerto 1883.

Se suscribe al tópico sensores/commands/1 (cada receptor puede tener su propio ID).