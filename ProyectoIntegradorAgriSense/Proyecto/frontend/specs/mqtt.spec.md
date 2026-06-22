# Spec: Control MQTT

## 1. SPEC

**Purpose:** Permitir al usuario enviar comandos de pausa/reanudación a nodos IoT específicos o a todos a la vez.

**Users:** Usuarios autenticados (ADMIN).

**Requirements:**
1. Ingresar ID de nodo.
2. Enviar comando "pause" o "resume" a nodo específico.
3. Enviar comando "pause" o "resume" a todos los nodos.
4. Mostrar respuesta del servidor.

**Edge cases:**
- Nodo inaccesible → mostrar error de red.
- ID de nodo vacío → no enviar comando.

**Acceptance criteria:**
- Dado que el usuario ingresa nodeId=1 y hace click en "Pausar nodo", entonces se muestra la respuesta del backend.
- Dado que el usuario hace click en "Reanudar TODOS", entonces el comando se envía a todos los nodos.

## 2. PLAN

**API contracts:**
- `POST /api/commands/node/:nodeId/pause` → texto de confirmación
- `POST /api/commands/node/:nodeId/resume` → texto de confirmación
- `POST /api/commands/all/pause` → texto de confirmación
- `POST /api/commands/all/resume` → texto de confirmación

**Architecture:** `src/pages/mqtt/MqttPage.jsx`. Reutiliza el hook `useMqttController` y el componente `MqttController`.

## 3. TASKS

**Task 1: Crear MqttPage.jsx**
Depends on: none
What to build: `src/pages/mqtt/MqttPage.jsx`
Acceptance criteria:
- Usa AppLayout como wrapper.
- Muestra título "Control MQTT" y descripción.
- Renderiza el componente MqttController existente.
- Muestra instrucciones de uso.