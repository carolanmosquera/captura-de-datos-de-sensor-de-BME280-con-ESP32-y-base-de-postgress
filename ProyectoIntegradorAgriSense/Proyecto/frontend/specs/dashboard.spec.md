# Spec: Dashboard

## 1. SPEC

**Purpose:** Mostrar al usuario autenticado un resumen en tiempo real del estado del sistema: métricas de sensores, alertas recientes y estado de nodos IoT.

**Users:** Usuarios autenticados (FARMER y ADMIN).

**Requirements:**
1. Mostrar 4 KPI cards: Temperatura, Humedad, Presión, Altitud (última lectura del nodo 1).
2. Mostrar un listado de las últimas 5 alertas con su severidad.
3. Mostrar el conteo de cultivos y propiedades registrados.
4. Mostrar el estado de los masters IoT.
5. Cada sección carga y falla de forma independiente.

**Edge cases:**
- Sin datos de telemetría → mostrar "Sin lecturas disponibles" en KPIs.
- Sin alertas → mostrar "Sin alertas activas".
- Error en un endpoint → esa sección muestra error; el resto continúa cargando.

**Acceptance criteria:**
- Dado que hay datos de telemetría para el nodo 1, cuando carga el dashboard, entonces cada KPI card muestra el valor numérico correcto con su unidad.
- Dado que hay alertas con severidad HIGH, cuando carga el dashboard, entonces esas alertas tienen borde y texto en `--color-danger-500`.
- Dado que el endpoint `/api/rest/telemetry/last/1` responde 404, cuando carga el dashboard, entonces los KPIs muestran "Sin datos" sin romper las demás secciones.
- Dado que hay 3 cultivos y 2 propiedades, cuando carga el dashboard, entonces los contadores muestran "3" y "2" respectivamente.

## 2. PLAN

**Architecture:** `src/pages/dashboard/Dashboard.jsx`. Usa AppLayout con Sidebar. Compone 4 secciones con sus propios estados de carga.

**API contracts:**
- `GET /api/rest/telemetry/last/1` → `{ nodeId, temperatura, humedad, presion, altitud, timestamp }`
- `GET /api/alerts` → `[{ id, type, severity, message, createdAt }]`
- `GET /api/crops` → `[{ id, name }]`
- `GET /api/properties` → `[{ id, name }]`
- `GET /api/master` → `[{ id, ... }]`

## 3. TASKS

**Task 1: Crear AppLayout con Sidebar**
Depends on: none
What to build: `src/components/layout/AppLayout.jsx` con sidebar de navegación y topbar.
Acceptance criteria:
- Renderiza un sidebar de 240px con links a: /dashboard, /crops, /properties, /sensors, /telemetry, /alerts, /notifications, /mqtt, /profile.
- El link activo tiene color `--color-primary-500`.
- Renderiza una topbar con el nombre de la app y el nombre del usuario autenticado.
- Acepta y renderiza `children` en el área de contenido.

**Task 2: Crear componente MetricCard**
Depends on: none
What to build: `src/components/shared/MetricCard.jsx`
Acceptance criteria:
- Acepta props: `title`, `value`, `unit`, `icon`, `loading`, `error`.
- Cuando `loading === true`, muestra un skeleton placeholder.
- Cuando `error !== null`, muestra "Sin datos".
- Cuando tiene datos, muestra `value` en font-mono y `unit` en text-sm.

**Task 3: Crear Dashboard.jsx**
Depends on: Task 1, Task 2
What to build: Página con 4 MetricCards y lista de alertas.
Acceptance criteria:
- Llama a `telemetryService.getLast(1)` en useEffect y mapea temp/humedad/presion/altitud a 4 MetricCards.
- Llama a `alertService.getAll()` y muestra las primeras 5 ordenadas por `createdAt` desc.
- Llama a `cropService.getAll()` y `propertyService.getAll()` para mostrar contadores.
- Cada llamada tiene su propio estado de loading y error independiente.