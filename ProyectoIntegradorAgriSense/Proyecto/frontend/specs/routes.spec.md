# Spec: Configuración de Rutas

## 1. SPEC

**Purpose:** Definir todas las rutas de la aplicación, sus permisos y redirects inteligentes.

**Requirements:**
1. Rutas públicas: /login, /register.
2. Rutas protegidas: todas las demás.
3. "/" redirige a /dashboard si hay token, o a /login si no.
4. Rutas inexistentes redirigen a /login.

**Acceptance criteria:**
- Dado que no hay token, cuando el usuario visita /, entonces es redirigido a /login.
- Dado que hay token, cuando el usuario visita /, entonces es redirigido a /dashboard.
- Dado que no hay token, cuando el usuario visita /dashboard directamente, entonces es redirigido a /login.
- Dado que hay token, cuando el usuario visita /login, entonces es redirigido a /dashboard.

## 2. PLAN

**Architecture:** `src/App.jsx`. Usa BrowserRouter + Routes de react-router-dom v7.

**Tabla de rutas:**

| Ruta | Componente | Protegida |
|---|---|---|
| / | RootRedirect (lógica) | No |
| /login | Login | No |
| /register | Register | No |
| /dashboard | Dashboard | Sí |
| /crops | Crops | Sí |
| /properties | Properties | Sí |
| /sensors | Sensors | Sí |
| /sensors/:slaveId | NodeDetail | Sí |
| /telemetry | Telemetry | Sí |
| /alerts | Alerts | Sí |
| /notifications | Notifications | Sí |
| /mqtt | MqttPage | Sí |
| /profile | Profile | Sí |
| * | → /login | No |

## 3. TASKS

**Task 1: Reescribir App.jsx**
Depends on: todos los componentes de página creados
What to build: App.jsx completo con todas las rutas.
Acceptance criteria:
- Componente RootRedirect lee token de localStorage y redirige apropiadamente.
- Todas las rutas protegidas usan <ProtectedRoute>.
- Login/Register redirigen a /dashboard si ya hay token.
- AuthProvider envuelve todo el árbol.