# Spec: Notificaciones

## 1. SPEC

**Purpose:** Mostrar las notificaciones del usuario autenticado y permitir marcarlas como leídas o eliminarlas.

**Users:** Usuarios autenticados.

**Requirements:**
1. Listar notificaciones del usuario actual.
2. Marcar notificación como leída.
3. Eliminar notificación.
4. Indicador visual de no leídas vs leídas.

**Edge cases:**
- Sin notificaciones → "No tienes notificaciones".
- Error de red → mostrar mensaje de error.

**Acceptance criteria:**
- Dado que el usuario tiene notificaciones, cuando carga la página, entonces se listan ordenadas por fecha descendente.
- Dado que el usuario marca como leída, cuando hace click, entonces el indicador visual cambia y el estado se actualiza.
- Dado que el usuario elimina una notificación, cuando confirma, entonces desaparece de la lista.

## 2. PLAN

**API contracts:**
- `GET /api/notifications/user/:userId` → `[{ id, message, readStatus, createdAt }]`
- `PUT /api/notifications/:id` → body: `{ ...notificationData, readStatus: 'read' }` → 200
- `DELETE /api/notifications/:id` → 204

## 3. TASKS

**Task 1: Crear Notifications.jsx**
Depends on: none
What to build: `src/pages/notifications/Notifications.jsx`
Acceptance criteria:
- Obtiene userId desde useAuth().user.id
- Carga notificaciones con notificationService.getByUser(userId).
- handleMarkRead llama notificationService.markAsRead(id, data) y actualiza readStatus en estado local.
- handleDelete llama notificationService.remove(id) y filtra del estado.
- Notificaciones no leídas tienen borde left con --color-primary-500.
- Notificaciones leídas tienen opacidad reducida.