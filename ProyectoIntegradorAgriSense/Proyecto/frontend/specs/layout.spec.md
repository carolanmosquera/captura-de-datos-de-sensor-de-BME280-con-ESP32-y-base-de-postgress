# Spec: Layouts de la Aplicación

## 1. SPEC

**Purpose:** Proveer dos layouts reutilizables: uno para páginas públicas (auth) y uno para páginas privadas (app con sidebar).

**Users:** Toda la aplicación los usa internamente.

**Requirements:**
1. AuthLayout: contenedor centrado para login/register.
2. AppLayout: sidebar fijo de 240px + área de contenido con topbar.

**Acceptance criteria:**
- Dado que se renderiza AuthLayout, entonces el contenido está centrado vertical y horizontalmente con fondo --color-bg-base.
- Dado que se renderiza AppLayout, entonces el sidebar muestra links de navegación y el área principal muestra children.
- Dado que el usuario navega a /dashboard con AppLayout, entonces el link "Dashboard" en el sidebar tiene color --color-primary-500.

## 2. PLAN

**Architecture:**
- `src/components/layout/AuthLayout.jsx`
- `src/components/layout/AppLayout.jsx`

**AuthLayout design:**
- Fondo: `--color-bg-base`
- Card central: `--color-bg-surface`, `--radius-lg`, `--shadow-card`
- Máximo ancho 420px, centrado con flexbox

**AppLayout design:**
- Sidebar: 240px, fondo `--color-bg-sidebar`, borde derecho `--color-border`
- Topbar: 64px de alto, fondo `--color-bg-surface`, border-bottom
- Contenido: fondo `--color-bg-base`, padding `--space-8`
- Links en sidebar: /dashboard, /crops, /properties, /sensors, /telemetry, /alerts, /notifications, /mqtt, /profile
- Link activo: color `--color-primary-500`, fondo `rgba(34,197,94,0.08)`
- Topbar muestra: nombre app (izquierda) y `user.name` + botón logout (derecha)

## 3. TASKS

**Task 1: Crear AuthLayout.jsx**
Depends on: none
What to build: `src/components/layout/AuthLayout.jsx`
Acceptance criteria:
- Exporta función `AuthLayout({ children })`.
- Renderiza div con clase `auth-layout` que centra contenido.
- Usa variables CSS del sistema de tokens.

**Task 2: Crear AppLayout.jsx**
Depends on: none
What to build: `src/components/layout/AppLayout.jsx`
Acceptance criteria:
- Importa `useAuth` para mostrar nombre de usuario y manejar logout.
- Renderiza sidebar con todos los links usando `NavLink` de react-router-dom.
- Link activo detectado automáticamente por NavLink.
- Acepta y renderiza `children` en área de contenido.
- El botón logout llama `logout()` del AuthContext y navega a `/login`.