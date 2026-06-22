# Spec: Monitoreo de Sensores IoT

## 1. SPEC

**Purpose:** Mostrar la jerarquía Master → Slave → Sensor con sus últimas mediciones, permitiendo al usuario explorar el estado de cada nodo.

**Users:** Usuarios autenticados.

**Requirements:**
1. Listar todos los masters ESP32.
2. Al seleccionar un master, cargar y mostrar sus slaves.
3. Al seleccionar un slave, cargar sus sensores y las últimas 10 mediciones.
4. Mostrar un indicador de estado por nodo.

**Edge cases:**
- Master sin slaves → mostrar "Sin nodos esclavos registrados".
- Slave sin mediciones → mostrar "Sin mediciones disponibles".

**Acceptance criteria:**
- Dado que hay masters, cuando carga la página, entonces se listan sus IDs y nombres.
- Dado que el usuario selecciona un master, cuando hace click, entonces se cargan sus slaves sin recargar la página.
- Dado que el usuario selecciona un slave, cuando hace click, entonces se muestran sus sensores y las últimas 10 mediciones en una tabla.
- Dado que no hay slaves para un master, cuando se expande el master, entonces se muestra "Sin nodos esclavos registrados".

## 2. PLAN

**API contracts:**
- `GET /api/master` → `[{ id, ... }]`
- `GET /api/slave/masters/:masterId` → `[{ id, ... }]`
- `GET /api/sensor/slaves/:slaveId` → `[{ id, name, type }]`
- `GET /api/measurement/slaves/:slaveId?limit=10` → `[{ id, valor, timestamp }]`

## 3. TASKS

**Task 1: Crear iotService.js**
Depends on: none
What to build: `src/services/iotService.js` con funciones: `getMasters()`, `getSlavesByMaster(masterId)`, `getSensorsBySlave(slaveId)`, `getMeasurementsBySlave(slaveId, limit)`.
Acceptance criteria:
- Cada función usa `apiClient`.
- Ninguna función usa `.then()` o `.catch()`.
- `getMeasurementsBySlave` acepta parámetro `limit` con default 10.

**Task 2: Crear Sensors.jsx**
Depends on: Task 1
What to build: Página con lista de masters expandibles.
Acceptance criteria:
- Carga masters al montar con useEffect + effect handler.
- Al hacer click en un master, llama `iotService.getSlavesByMaster(id)` y muestra los slaves debajo.
- El event handler se llama `handleSelectMaster`.
- Muestra loading spinner mientras carga cada nivel.

**Task 3: Crear NodeDetail.jsx**
Depends on: Task 1
What to build: Vista de detalle de un slave con sensores y mediciones.
Acceptance criteria:
- Recibe `slaveId` como URL param.
- Carga sensores y mediciones en paralelo con `Promise.all` dentro del effect handler.
- Muestra tabla de mediciones con columnas: timestamp, temperatura, humedad, presión, altitud.