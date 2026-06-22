# AgriSense API — Guía completa de pruebas con Postman

> Backend construido con **Spring Boot 3 + Spring Security (JWT) + PostgreSQL**.  
> Esta guía cubre **todos los endpoints** del sistema y permite a cualquier persona probar la API desde cero.

---

## Tabla de contenidos

1. [Requisitos previos](#1-requisitos-previos)
2. [Configuración inicial de Postman](#2-configuración-inicial-de-postman)
3. [Variables de entorno recomendadas](#3-variables-de-entorno-recomendadas)
4. [Flujo de autenticación paso a paso](#4-flujo-de-autenticación-paso-a-paso)
5. [Endpoints públicos](#5-endpoints-públicos)
6. [Endpoints protegidos](#6-endpoints-protegidos)
   - [6.1 Usuarios](#61-usuarios)
   - [6.2 Cultivos (Crops)](#62-cultivos-crops)
   - [6.3 Condiciones de cultivo (Crop Conditions)](#63-condiciones-de-cultivo-crop-conditions)
   - [6.4 Propiedades (Properties)](#64-propiedades-properties)
   - [6.5 Lotes (Plots)](#65-lotes-plots)
   - [6.6 Alertas](#66-alertas)
   - [6.7 Notificaciones](#67-notificaciones)
   - [6.8 Hardware IoT — Masters, Slaves, Sensores y Mediciones](#68-hardware-iot--masters-slaves-sensores-y-mediciones)
   - [6.9 Telemetría (Raw Sensor Data)](#69-telemetría-raw-sensor-data)
   - [6.10 Comandos MQTT](#610-comandos-mqtt)
7. [Posibles errores y soluciones](#7-posibles-errores-y-soluciones)
8. [Flujos recomendados de prueba](#8-flujos-recomendados-de-prueba)
9. [Recomendaciones finales](#9-recomendaciones-finales)

---

## 1. Requisitos previos

| Requisito | Detalle |
|---|---|
| **Postman** | Versión desktop o web. Descarga en [postman.com](https://www.postman.com/downloads/) |
| **Backend en ejecución** | `mvn spring-boot:run` o `docker-compose up` (usa este para conectar con el fronted) |
| **Base de datos** | PostgreSQL local (`localhost:5432/sensoresdb`) o Neon (cloud) |
| **Seed ejecutado** | El archivo `data.sql` se carga automáticamente al iniciar (`spring.sql.init.mode=always`) |
| **Puerto** | `8080` por defecto (o `8081` si se usa Docker con el mapping del `docker-compose.yml`) |

> **Tip Docker:** Si usas `docker-compose up`, la API queda expuesta en el puerto `8081` del host (mapeado al `8080` del contenedor). Ajusta `base_url` según corresponda.

---

## 2. Configuración inicial de Postman

### 2.1 Crear un nuevo entorno

1. En Postman, haz clic en el ícono de **Environments** (engranaje o globo ⚙️) → **Add**.
2. Nómbralo `AgriSense Local`.
3. Agrega las variables que se describen en la sección siguiente.
4. Selecciona este entorno en el selector superior derecho de Postman.

### 2.2 Configurar Authorization global en una Collection

1. Crea una nueva **Collection** llamada `AgriSense API`.
2. Ve a la pestaña **Authorization** de la Collection.
3. Selecciona el tipo `Bearer Token`.
4. En el campo **Token**, escribe `{{token}}`.

Con esto, todos los requests de la colección heredarán el token automáticamente; solo deberás marcarlo como _"Inherit auth from parent"_ en cada request individual.

---

## 3. Variables de entorno recomendadas

Crea las siguientes variables en el entorno `AgriSense Local`:

| Variable | Valor inicial | Descripción |
|---|---|---|
| `base_url` | `http://localhost:8080` | URL base de la API (usa `8081` si estás con Docker), usa este para conectar con el fronted |
| `token` | _(vacío)_ | Se llena automáticamente tras el login |
| `user_id` | `1` | ID del usuario admin del seed |
| `crop_id` | `1` | ID del cultivo Maíz del seed |
| `property_id` | `1` | ID de la primera propiedad |
| `plot_id` | `1` | ID del lote Norte A del seed |
| `alert_id` | _(vacío)_ | Se rellena al crear una alerta |
| `crop_condition_id` | _(vacío)_ | Se rellena al crear una condición |

---

## 4. Flujo de autenticación paso a paso

### 4.1 Registrar un nuevo usuario (opcional)

> Usa este endpoint si quieres crear un usuario nuevo. Si prefieres usar uno del seed, salta directamente al login.

**Endpoint:** `POST {{base_url}}/api/auth/register`

**Requiere autenticación:** ❌ No

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Test Usuario",
  "email": "test@agrisense.com",
  "password": "test123",
  "phone": "3001112233"
}
```

> El campo `phone` es opcional.  
> La contraseña debe tener **mínimo 6 caracteres**.  
> El nuevo usuario se registra con el rol `FARMER` por defecto (según `AuthService`).

**Respuesta esperada — `201 Created`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 6,
    "name": "Test Usuario",
    "email": "test@agrisense.com",
    "phone": "3001112233",
    "status": "activo"
  }
}
```

---

### 4.2 Iniciar sesión (Login)

**Endpoint:** `POST {{base_url}}/api/auth/login`

**Requiere autenticación:** ❌ No

**Headers:**
```
Content-Type: application/json
```

**Body (JSON) — usando el admin del seed:**
```json
{
  "email": "adriana@agrisense.com",
  "password": "admin123"
}
```
  
> Si obtienes `401`, prueba con el usuario registrado en el paso 4.1, cuya contraseña sí conoces.

**Respuesta esperada — `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHJpYW5hQGFncmlzZW5zZS5jb20i...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "name": "Adriana Murillo",
    "email": "adriana@agrisense.com",
    "phone": "3001234567",
    "status": "activo"
  }
}
```

---

### 4.3 Guardar el token automáticamente

Agrega este **script** en la pestaña **Tests** del request de Login para que Postman guarde el token automáticamente:

```javascript
const json = pm.response.json();
if (json.accessToken) {
    pm.environment.set("token", json.accessToken);
    console.log("✅ Token guardado:", json.accessToken.substring(0, 30) + "...");
}
```

---

### 4.4 Usar el token en los endpoints protegidos

Para **cada request protegido**, tienes dos opciones:

**Opción A — Heredar de la Collection (recomendado):**
- En la pestaña **Authorization** del request → selecciona `Inherit auth from parent`.
- Postman usará automáticamente `Bearer {{token}}`.

**Opción B — Configurar manualmente en el request:**
- Pestaña **Authorization** → Tipo: `Bearer Token` → Token: `{{token}}`

**O agregar el header directamente:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

> El token JWT tiene una validez de **24 horas** (`JWT_EXPIRATION_MS=86400000`). Después debes hacer login nuevamente.

---

## 5. Endpoints públicos

Estos endpoints **no requieren token JWT**.

---

### 5.1 POST telemetría desde ESP32

**Endpoint:** `POST {{base_url}}/api/rest/telemetry`

**Requiere autenticación:** ❌ No (diseñado para el ESP32)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nodeId": 1,
  "temperatura": 24.5,
  "humedad": 65.3,
  "presion": 1012.4,
  "altitud": 1020.0,
  "timestamp": null
}
```

> Si `timestamp` es `null`, el backend asigna la hora actual automáticamente.

**Respuesta esperada — `201 Created`:**
```
Datos guardados correctamente
```

---

### 5.2 Swagger UI (documentación interactiva)

**URL:** `GET {{base_url}}/swagger-ui/index.html`

> No requiere autenticación. Permite explorar y probar todos los endpoints desde el navegador.

---

## 6. Endpoints protegidos

> ⚠️ **Todos los endpoints de esta sección requieren el header:**
> ```
> Authorization: Bearer {{token}}
> ```
> Sin este header, el servidor responde `401 Unauthorized`.

---

### 6.1 Usuarios

**Base URL:** `{{base_url}}/api/users`

---

#### GET — Listar todos los usuarios

```
GET {{base_url}}/api/users
```

| Campo | Valor |
|---|---|
| Método | GET |
| Auth | Bearer Token |
| Body | Ninguno |

**Respuesta `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Adriana Murillo",
    "email": "adriana@agrisense.com",
    "phone": "3001234567",
    "status": "activo",
    "roleId": 1,
    "roleName": "ADMIN"
  },
  {
    "id": 2,
    "name": "Carlos Rodríguez",
    "email": "carlos@agrisense.com",
    "phone": "3109876543",
    "status": "activo",
    "roleId": 2,
    "roleName": "FARMER"
  }
]
```

---

#### GET — Obtener usuario por ID

```
GET {{base_url}}/api/users/{{user_id}}
```

| Campo | Valor |
|---|---|
| Método | GET |
| Path param | `id` — ID del usuario |
| Auth | Bearer Token |

**Respuesta `200 OK`:** objeto de usuario individual.

**Error `404 Not Found`:** si el ID no existe.

---

#### PUT — Actualizar usuario

```
PUT {{base_url}}/api/users/{{user_id}}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "name": "Adriana Murillo Actualizada",
  "email": "adriana@agrisense.com",
  "passwordHash": "nuevaPassword123",
  "phone": "3001234567",
  "status": "activo",
  "roleId": 1
}
```

> El campo `passwordHash` recibe la contraseña en texto plano; el backend la hashea automáticamente.

**Respuesta `200 OK`:** objeto de usuario actualizado.

---

#### DELETE — Eliminar usuario

```
DELETE {{base_url}}/api/users/2
```

| Campo | Valor |
|---|---|
| Método | DELETE |
| Path param | `id` — ID del usuario a eliminar |
| Auth | Bearer Token |

**Respuesta `204 No Content`:** eliminación exitosa (sin cuerpo).

**Error `404`:** si el ID no existe.

---

### 6.2 Cultivos (Crops)

**Base URL:** `{{base_url}}/api/crops`

El seed ya incluye 3 cultivos: **Maíz** (id=1), **Café** (id=2), **Caña** (id=3).

---

#### GET — Listar todos los cultivos

```
GET {{base_url}}/api/crops
```

**Respuesta `200 OK`:**
```json
[
  { "id": 1, "name": "Maíz", "scientificName": "Zea mays", "description": "Cultivo de grano básico..." },
  { "id": 2, "name": "Café", "scientificName": "Coffea arabica", "description": "Cultivo emblema..." },
  { "id": 3, "name": "Caña", "scientificName": "Saccharum officinarum", "description": "Caña de azúcar..." }
]
```

---

#### GET — Obtener cultivo por ID

```
GET {{base_url}}/api/crops/1
```

**Respuesta `200 OK`:** objeto de cultivo individual.

---

#### POST — Crear cultivo

```
POST {{base_url}}/api/crops
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "name": "Yuca",
  "scientificName": "Manihot esculenta",
  "description": "Tubérculo muy cultivado en zonas tropicales colombianas"
}
```

> `scientificName` y `description` son opcionales.

**Respuesta `201 Created`:**
```json
{
  "id": 4,
  "name": "Yuca",
  "scientificName": "Manihot esculenta",
  "description": "Tubérculo muy cultivado en zonas tropicales colombianas"
}
```

---

#### PUT — Actualizar cultivo

```
PUT {{base_url}}/api/crops/4
```

**Body (JSON):**
```json
{
  "name": "Yuca Dulce",
  "scientificName": "Manihot esculenta",
  "description": "Variedad dulce para consumo directo"
}
```

**Respuesta `200 OK`:** objeto actualizado.

---

#### DELETE — Eliminar cultivo

```
DELETE {{base_url}}/api/crops/4
```

**Respuesta `204 No Content`.**

---

### 6.3 Condiciones de cultivo (Crop Conditions)

**Base URL:** `{{base_url}}/api/crop-conditions`

Define los rangos ideales de temperatura y humedad para un cultivo en una etapa fenológica específica.

---

#### GET — Listar todas las condiciones

```
GET {{base_url}}/api/crop-conditions
```

---

#### GET — Obtener condición por ID

```
GET {{base_url}}/api/crop-conditions/1
```

---

#### GET — Condiciones por cultivo

```
GET {{base_url}}/api/crop-conditions/crop/1
```

> Devuelve todas las condiciones del cultivo con ID=1 (Maíz).

---

#### POST — Crear condición de cultivo

```
POST {{base_url}}/api/crop-conditions
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "cropId": 1,
  "minTemperature": 18.0,
  "maxTemperature": 32.0,
  "minHumidity": 50.0,
  "maxHumidity": 80.0,
  "stageId": 3
}
```

> `stageId` referencia la tabla `phenological_stage`. Etapas disponibles del seed: 1=Germinación, 2=Emergencia, 3=Crecimiento vegetativo, 4=Floración, 5=Fructificación, 6=Maduración, 7=Cosecha, 8=Senescencia.

**Respuesta `201 Created`:**
```json
{
  "id": 1,
  "cropId": 1,
  "cropName": "Maíz",
  "minTemperature": 18.0,
  "maxTemperature": 32.0,
  "minHumidity": 50.0,
  "maxHumidity": 80.0,
  "stageId": 3,
  "stageName": "Crecimiento vegetativo"
}
```

---

#### PUT — Actualizar condición de cultivo

```
PUT {{base_url}}/api/crop-conditions/1
```

**Body:** mismo esquema que el POST, con los valores modificados.

---

#### DELETE — Eliminar condición de cultivo

```
DELETE {{base_url}}/api/crop-conditions/1
```

**Respuesta `204 No Content`.**

---

### 6.4 Propiedades (Properties)

**Base URL:** `{{base_url}}/api/properties`

Representa los predios agrícolas registrados en el sistema.

---

#### GET — Listar todas las propiedades

```
GET {{base_url}}/api/properties
```

---

#### GET — Obtener propiedad por ID

```
GET {{base_url}}/api/properties/1
```

---

#### GET — Propiedades por dueño

```
GET {{base_url}}/api/properties/owner/2
```

> Devuelve las propiedades del usuario con ID=2 (Carlos Rodríguez, FARMER).

---

#### POST — Crear propiedad

```
POST {{base_url}}/api/properties
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "name": "Finca La Esperanza",
  "ownerId": 2,
  "propertyTypeId": 1,
  "areaHectares": 12.5,
  "locationId": 5
}
```

> `propertyTypeId` referencia `property_type`: 1=Finca, 2=Invernadero, 3=Parcela, 4=Hacienda, 5=Vivero, 6=Experimental.  
> `locationId` referencia `location`: 1=Cali, 2=Palmira, 3=Tuluá, 4=Cartago, 5=Jamundí, 6=Buenaventura.

**Respuesta `201 Created`:**
```json
{
  "id": 2,
  "name": "Finca La Esperanza",
  "ownerId": 2,
  "ownerName": "Carlos Rodríguez",
  "propertyTypeId": 1,
  "propertyTypeName": "Finca",
  "areaHectares": 12.5,
  "locationId": 5
}
```

---

#### PUT — Actualizar propiedad

```
PUT {{base_url}}/api/properties/2
```

**Body:** mismo esquema que el POST.

---

#### DELETE — Eliminar propiedad

```
DELETE {{base_url}}/api/properties/2
```

**Respuesta `204 No Content`.**

---

### 6.5 Lotes (Plots)

**Base URL:** `{{base_url}}/api/plots`

Los lotes son subdivisiones de una propiedad asociadas a un cultivo y una ubicación. El seed incluye 4 lotes dentro de la propiedad 1.

---

#### GET — Listar todos los lotes

```
GET {{base_url}}/api/plots
```

**Respuesta `200 OK`:**
```json
[
  { "id": 1, "name": "Lote Norte A", "area": 5.8, "propertyId": 1, "propertyName": "...", "cropId": 1, "cropName": "Maíz", "locationId": 1 },
  { "id": 2, "name": "Lote Sur B", "area": 4.2, "propertyId": 1, "propertyName": "...", "cropId": 1, "cropName": "Maíz", "locationId": 2 },
  { "id": 3, "name": "Lote Café 1", "area": 3.0, "propertyId": 1, "propertyName": "...", "cropId": 2, "cropName": "Café", "locationId": 3 },
  { "id": 4, "name": "Lote Caña Central", "area": 6.5, "propertyId": 1, "propertyName": "...", "cropId": 3, "cropName": "Caña", "locationId": 5 }
]
```

---

#### GET — Obtener lote por ID

```
GET {{base_url}}/api/plots/1
```

---

#### GET — Lotes por propiedad

```
GET {{base_url}}/api/plots/property/1
```

> Devuelve todos los lotes de la propiedad 1.

---

#### POST — Crear lote

```
POST {{base_url}}/api/plots
```

**Body (JSON):**
```json
{
  "name": "Lote Este C",
  "area": 2.3,
  "propertyId": 1,
  "cropId": 2,
  "locationId": 3
}
```

**Respuesta `201 Created`:** objeto del lote creado.

---

#### PUT — Actualizar lote

```
PUT {{base_url}}/api/plots/1
```

**Body:** mismo esquema que el POST.

---

#### DELETE — Eliminar lote

```
DELETE {{base_url}}/api/plots/5
```

**Respuesta `204 No Content`.**

---

### 6.6 Alertas

**Base URL:** `{{base_url}}/api/alerts`

Las alertas son generadas por el sistema cuando los valores de los sensores salen de los rangos de la condición de cultivo.

---

#### GET — Listar todas las alertas

```
GET {{base_url}}/api/alerts
```

---

#### GET — Obtener alerta por ID

```
GET {{base_url}}/api/alerts/1
```

---

#### GET — Alertas por nodo esclavo

```
GET {{base_url}}/api/alerts/slave/1
```

> Devuelve todas las alertas asociadas al esclavo IoT con ID=1.

---

#### POST — Crear alerta

```
POST {{base_url}}/api/alerts
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "type": "TEMPERATURA",
  "severity": "HIGH",
  "message": "Temperatura superior al rango permitido para la etapa de Floración",
  "generatedBy": "SYSTEM",
  "dataId": null,
  "cropConditionId": 1,
  "slaveId": 1
}
```

> `severity` valores comunes: `"LOW"`, `"MEDIUM"`, `"HIGH"`.  
> `generatedBy` acepta hasta 10 caracteres: `"SYSTEM"`, `"MANUAL"`, etc.  
> `dataId` puede ser `null` si no hay un dato de medición asociado.

**Respuesta `201 Created`:**
```json
{
  "id": 1,
  "type": "TEMPERATURA",
  "severity": "HIGH",
  "message": "Temperatura superior al rango permitido para la etapa de Floración",
  "generatedBy": "SYSTEM",
  "dataId": null,
  "cropConditionId": 1,
  "slaveId": 1,
  "createdAt": "2025-05-22T10:30:00"
}
```

---

#### PUT — Actualizar alerta

```
PUT {{base_url}}/api/alerts/1
```

**Body:** mismo esquema que el POST.

---

#### DELETE — Eliminar alerta

```
DELETE {{base_url}}/api/alerts/1
```

**Respuesta `204 No Content`.**

---

### 6.7 Notificaciones

**Base URL:** `{{base_url}}/api/notifications`

Las notificaciones asocian una alerta con un usuario (quién debe recibirla).

> **Dependencia:** Para crear una notificación necesitas un `alertId` válido. Crea primero una alerta y anota su ID.

---

#### GET — Listar todas las notificaciones

```
GET {{base_url}}/api/notifications
```

---

#### GET — Obtener notificación por ID

```
GET {{base_url}}/api/notifications/1
```

---

#### GET — Notificaciones por usuario

```
GET {{base_url}}/api/notifications/user/1
```

> Devuelve todas las notificaciones del usuario con ID=1 (Adriana / Admin).

---

#### POST — Crear notificación

```
POST {{base_url}}/api/notifications
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "message": "Se ha detectado temperatura alta en Lote Café 1",
  "readStatus": "unread",
  "userId": 2,
  "alertId": 1
}
```

> `readStatus` acepta hasta 10 caracteres: `"unread"`, `"read"`, etc.

**Respuesta `201 Created`:** objeto de la notificación creada.

---

#### PUT — Actualizar notificación (marcar como leída)

```
PUT {{base_url}}/api/notifications/1
```

**Body (JSON):**
```json
{
  "message": "Se ha detectado temperatura alta en Lote Café 1",
  "readStatus": "read",
  "userId": 2,
  "alertId": 1
}
```

---

#### DELETE — Eliminar notificación

```
DELETE {{base_url}}/api/notifications/1
```

**Respuesta `204 No Content`.**

---

### 6.8 Hardware IoT — Masters, Slaves, Sensores y Mediciones

Estos endpoints consultan el estado de los dispositivos ESP32 registrados en la base de datos.

---

#### GET — Listar todos los masters (ESP32 Master)

```
GET {{base_url}}/api/master
```

**Requiere Auth:** ✅ Bearer Token

**Respuesta `200 OK`:** lista de objetos `Esp32Master` (id, nombre, IP, estado, etc.).

---

#### GET — Slaves por master

```
GET {{base_url}}/api/slave/masters/1
```

| Campo | Valor |
|---|---|
| Método | GET |
| Path param | `masterId` — ID del master |
| Auth | Bearer Token |

**Respuesta `200 OK`:** lista de objetos `Esp32Slave` asociados al master especificado.

---

#### GET — Sensores por slave

```
GET {{base_url}}/api/sensor/slaves/1
```

| Campo | Valor |
|---|---|
| Método | GET |
| Path param | `slaveId` — ID del esclavo |
| Auth | Bearer Token |

**Respuesta `200 OK`:** lista de sensores (`Sensor`) asociados al esclavo.

---

#### GET — Tipos de sensores disponibles

```
GET {{base_url}}/api/sensor/sensor-types
```

**Respuesta `200 OK`:**
```json
[
  { "id": 1, "name": "temperatura", "unit": "°C" },
  { "id": 2, "name": "humedad", "unit": "%" },
  { "id": 3, "name": "presion", "unit": "hPa" },
  { "id": 4, "name": "altitud", "unit": "m" },
  { "id": 5, "name": "extra", "unit": "unidad_extra" }
]
```

---

#### GET — Últimas mediciones de un slave

```
GET {{base_url}}/api/measurement/slaves/1?limit=10
```

| Campo | Valor |
|---|---|
| Método | GET |
| Path param | `slaveId` — ID del esclavo |
| Query param | `limit` — número de registros (por defecto: `10`) |
| Auth | Bearer Token |

**Ejemplo con más registros:**
```
GET {{base_url}}/api/measurement/slaves/1?limit=50
```

**Respuesta `200 OK`:** lista de objetos `MeasurementData` con los últimos N registros del esclavo.

---

### 6.9 Telemetría (Raw Sensor Data)

**Base URL:** `{{base_url}}/api/rest/telemetry`

---

#### GET — Ver todos los datos de telemetría

```
GET {{base_url}}/api/rest/telemetry
```

**Requiere Auth:** ✅ Bearer Token

**Respuesta `200 OK`:** array con todos los objetos `SensorData` almacenados.

---

#### GET — Últimos 10 registros por nodo

```
GET {{base_url}}/api/rest/telemetry/last10/1
```

| Campo | Valor |
|---|---|
| Método | GET |
| Path param | `nodeId` — ID del nodo (entero) |
| Auth | Bearer Token |

**Respuesta `200 OK`:** lista con los últimos 10 registros del nodo especificado.

---

#### GET — Último registro de un nodo

```
GET {{base_url}}/api/rest/telemetry/last/1
```

**Respuesta `200 OK`:** objeto `SensorData` más reciente del nodo.

**Respuesta `404 Not Found`:** si el nodo no tiene registros.

---

#### POST — Enviar telemetría (endpoint público, para ESP32)

```
POST {{base_url}}/api/rest/telemetry
```

> Ya documentado en [Sección 5.1](#51-post-telemetría-desde-esp32). No requiere token.

---

### 6.10 Comandos MQTT

**Base URL:** `{{base_url}}/api/commands`

Permite pausar o reanudar el envío de datos de nodos IoT mediante mensajes MQTT al broker Mosquitto.

> ⚠️ Estos endpoints requieren que el broker MQTT esté activo. Si Mosquitto no está corriendo, el endpoint retorna `500 Internal Server Error`.

---

#### POST — Comando a un nodo específico

```
POST {{base_url}}/api/commands/node/2/pause
POST {{base_url}}/api/commands/node/2/resume
```

| Campo | Valor |
|---|---|
| Método | POST |
| Path params | `nodeId` (entero), `action` (`pause` o `resume`) |
| Body | Ninguno |
| Auth | Bearer Token |

**Respuesta `200 OK`:**
```
Comando 'PAUSE' enviado al nodo 2
```

---

#### POST — Comando a todos los nodos

```
POST {{base_url}}/api/commands/all/pause
POST {{base_url}}/api/commands/all/resume
```

| Campo | Valor |
|---|---|
| Método | POST |
| Path param | `action` (`pause` o `resume`) |
| Body | Ninguno |
| Auth | Bearer Token |

**Respuesta `200 OK`:**
```
Comando 'PAUSE' enviado a todos los nodos
```

---

## 7. Posibles errores y soluciones

| Código | Causa más común | Solución |
|---|---|---|
| `401 Unauthorized` | Token ausente, vencido o malformado | Haz login nuevamente y actualiza la variable `{{token}}`. Verifica que el header sea `Authorization: Bearer <token>` (con espacio después de Bearer). |
| `403 Forbidden` | Token válido pero el usuario no tiene permisos para esa operación | Usa un usuario con rol `ADMIN` (`adriana@agrisense.com`). |
| `400 Bad Request` | Body inválido o campos requeridos faltantes | Revisa el body. El mensaje de error indica exactamente qué campo falla (ej.: `"El nombre del cultivo es obligatorio"`). |
| `404 Not Found` | El recurso solicitado no existe en la BD | Verifica el ID en el path. Usa los endpoints `GET` para obtener IDs válidos antes de hacer PUT/DELETE. |
| `409 Conflict` | Email duplicado en registro o violación de unique constraint | Usa un email diferente o consulta si el recurso ya existe. |
| `500 Internal Server Error` | Error de servidor, generalmente en endpoints MQTT si Mosquitto no está activo | Verifica que `docker-compose up` incluya el servicio `mosquitto`. Revisa los logs con `docker logs sensores-mosquitto`. |
| `415 Unsupported Media Type` | Falta el header `Content-Type: application/json` en requests con body | Agrega el header `Content-Type: application/json` a todos los POST y PUT. |

---

## 8. Flujos recomendados de prueba

### Flujo 1 — Verificación de autenticación desde cero

```
1. POST /api/auth/register        → crea un usuario nuevo
2. POST /api/auth/login           → obtén el JWT
3. GET  /api/users                → verifica que el token funciona (responde 200)
4. GET  /api/users/1              → consulta el admin del seed
```

### Flujo 2 — Creación completa de un predio con lote

```
1. POST /api/auth/login           → obtén token (usa adriana@agrisense.com)
2. GET  /api/crops                → lista los cultivos del seed (id: 1, 2, 3)
3. POST /api/properties           → crea propiedad (ownerId=2, propertyTypeId=1, locationId=5)
4. POST /api/plots                → crea lote asociado a la propiedad del paso 3
5. GET  /api/plots/property/{id}  → verifica que el lote aparece bajo la propiedad
```

### Flujo 3 — Ciclo de alerta y notificación

```
1. POST /api/auth/login               → obtén token
2. POST /api/crop-conditions          → crea una condición de cultivo (cropId=1, stageId=3)
3. POST /api/alerts                   → crea una alerta referenciando cropConditionId del paso 2
4. POST /api/notifications            → crea notificación asociando alertId del paso 3 y userId=2
5. GET  /api/notifications/user/2     → verifica que Carlos Rodríguez tiene la notificación
6. PUT  /api/notifications/{id}       → marca la notificación como "read"
```

### Flujo 4 — Monitoreo de sensores IoT

```
1. POST /api/auth/login               → obtén token
2. GET  /api/master                   → lista los masters ESP32 registrados
3. GET  /api/slave/masters/1          → lista los slaves del master 1
4. GET  /api/sensor/slaves/1          → lista los sensores del slave 1
5. GET  /api/measurement/slaves/1     → obtén las últimas 10 mediciones del slave 1
6. GET  /api/rest/telemetry/last/1    → último dato crudo del nodo 1
```

### Flujo 5 — Prueba de telemetría sin token (simular ESP32)

```
1. POST /api/rest/telemetry       → envía dato sin Authorization header (debe dar 201)
2. POST /api/auth/login           → obtén token
3. GET  /api/rest/telemetry       → verifica que el dato anterior aparece en la lista
4. GET  /api/rest/telemetry/last10/1  → los 10 últimos del nodo 1
```

---

## 9. Recomendaciones finales

**Orden de prueba sugerido para la primera sesión:**
1. Levanta el backend y verifica que responde en `GET {{base_url}}/swagger-ui/index.html`.
2. Haz login con `adriana@agrisense.com` y guarda el token.
3. Prueba un endpoint GET simple (ej. `GET /api/crops`) para confirmar que el token funciona.
4. Sigue los flujos de la sección anterior en orden.

**Gestión del token en Postman:**
- Usa el script de Tests en el request de Login para automatizar el guardado del token en la variable de entorno `{{token}}`.
- Si ves `401` en un endpoint que antes funcionaba, el token expiró (validez de 24 horas). Repite el login.

**Datos del seed disponibles para pruebas:**

| Entidad | IDs disponibles |
|---|---|
| Usuarios | 1 (ADMIN), 2 (FARMER), 3 (FARMER), 4 (TECHNICIAN), 5 (FARMER inactivo) |
| Cultivos | 1=Maíz, 2=Café, 3=Caña |
| Locations | 1=Cali, 2=Palmira, 3=Tuluá, 4=Cartago, 5=Jamundí, 6=Buenaventura |
| Tipos de propiedad | 1=Finca, 2=Invernadero, 3=Parcela, 4=Hacienda, 5=Vivero, 6=Experimental |
| Etapas fenológicas | 1 a 8 (Germinación → Senescencia) |
| Lotes | 1=Lote Norte A, 2=Lote Sur B, 3=Lote Café 1, 4=Lote Caña Central |
| Tipos de sensor | 1=temperatura, 2=humedad, 3=presion, 4=altitud, 5=extra |

**Probar con Swagger:**
- `GET {{base_url}}/swagger-ui/index.html` ofrece documentación interactiva.
- Para endpoints protegidos en Swagger, haz clic en **Authorize** e ingresa `Bearer <tu_token>`.

**Verificar MQTT:**
- Los endpoints `/api/commands/**` solo funcionan con Mosquitto activo.
- Con Docker: el servicio `mosquitto` se levanta automáticamente con `docker-compose up`.
- Sin Docker: instala y levanta Mosquitto localmente en el puerto `1883` antes de probar estos endpoints.
