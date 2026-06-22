# Spec: Gestión de Alertas

## 1. SPEC

**Purpose:** Mostrar al usuario todas las alertas del sistema con capacidad de filtrado por severidad y tipo.

**Users:** Usuarios autenticados.

**Requirements:**
1. Listar todas las alertas ordenadas por fecha descendente.
2. Filtrar alertas por severidad (HIGH, MEDIUM, LOW).
3. Mostrar badge de color por severidad.
4. Permitir eliminar una alerta.

**Edge cases:**
- Sin alertas → mostrar "No hay alertas registradas".
- Filtro sin resultados → mostrar "No hay alertas con el filtro seleccionado".

**Acceptance criteria:**
- Dado que hay alertas, cuando carga la página, entonces se muestran ordenadas por `createdAt` descendente.
- Dado que el usuario selecciona filtro "HIGH", cuando hace click, entonces solo se muestran alertas con `severity === "HIGH"`.
- Dado que no hay alertas, cuando carga la página, entonces se muestra "No hay alertas registradas".
- Dado que el usuario elimina una alerta, cuando confirma, entonces desaparece de la lista.

## 2. PLAN

**API contracts:**
- `GET /api/alerts` → `[{ id, type, severity, message, generatedBy, slaveId, createdAt }]`
- `DELETE /api/alerts/:id` → 204

## 3. TASKS

**Task 1: Crear alertService.js**
Depends on: none
What to build: `src/services/alertService.js` con `getAll`, `getById`, `getBySlave`, `create`, `update`, `remove`.
Acceptance criteria:
- Todas las funciones usan apiClient.
- `getAll` retorna el array directamente desde `response.data`.

**Task 2: Crear AlertBadge.jsx**
Depends on: none
What to build: `src/components/shared/AlertBadge.jsx` que muestra un badge de color según severidad.
Acceptance criteria:
- Acepta prop `severity` (string).
- HIGH → texto rojo, borde rojo, fondo rojo-dark.
- MEDIUM → texto ámbar, borde ámbar, fondo ámbar-dark.
- LOW → texto azul, borde azul, fondo azul-dark.
- Usa variables CSS `--color-danger-500`, `--color-warning-500`, `--color-info-500`.

**Task 3: Crear Alerts.jsx**
Depends on: Task 1, Task 2
What to build: Página con tabla de alertas y filtros.
Acceptance criteria:
- `filterSeverity` (string|null) en useState, inicializado en null.
- La lista mostrada es `alerts.filter(a => !filterSeverity || a.severity === filterSeverity)`.
- Event handler `handleFilterChange(severity)` actualiza `filterSeverity`.
- Event handler `handleDelete(id)` llama `alertService.remove(id)` y actualiza el array de estado.