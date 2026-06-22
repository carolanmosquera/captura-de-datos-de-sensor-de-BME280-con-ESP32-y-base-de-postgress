# Spec: Telemetría

## 1. SPEC

**Purpose:** Mostrar el historial completo de datos de telemetría capturados por los nodos IoT.

**Users:** Usuarios autenticados.

**Requirements:**
1. Listar todos los registros de telemetría en tabla paginada o scrollable.
2. Mostrar columnas: ID, NodeID, Temperatura, Humedad, Presión, Altitud, Timestamp.
3. Permitir refrescar manualmente.

**Edge cases:**
- Sin datos → "No hay registros de telemetría".
- Error de red → mostrar mensaje de error con botón de reintento.

**Acceptance criteria:**
- Dado que hay registros, cuando carga la página, entonces la tabla los muestra ordenados por timestamp descendente.
- Dado que el usuario hace click en "Actualizar", entonces se recarga la tabla.

## 2. PLAN

**API contracts:**
- `GET /api/rest/telemetry` → `[{ id, nodeId, temperatura, humedad, presion, altitud, timestamp }]`

**Architecture:** `src/pages/telemetry/Telemetry.jsx`. Usa `telemetryService.getAll()` (NO sensorDataService — ese debe eliminarse).

## 3. TASKS

**Task 1: Crear Telemetry.jsx**
Depends on: none
What to build: `src/pages/telemetry/Telemetry.jsx`
Acceptance criteria:
- Usa telemetryService.getAll() para cargar datos.
- Tiene estado loading, error, data.
- Botón "Actualizar" llama refetch.
- Tabla con columnas: ID, Node, Temperatura (°C), Humedad (%), Presión (hPa), Altitud (m), Timestamp.
- Timestamp formateado con toLocaleString().