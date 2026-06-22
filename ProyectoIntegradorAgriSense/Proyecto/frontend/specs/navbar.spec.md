# Spec: Navbar (Topbar del AppLayout)

## 1. SPEC

**Purpose:** Mostrar la identidad de la app, la navegación principal y el usuario autenticado.

**Users:** Usuarios autenticados en cualquier página del sistema.

**Requirements:**
1. Mostrar logo/nombre "AGRISENSE" a la izquierda.
2. Mostrar nombre del usuario autenticado.
3. Mostrar botón de logout.
4. Navegar correctamente a todas las secciones.

**Acceptance criteria:**
- Dado que el usuario está en /dashboard, cuando mira la navbar, entonces ve "AGRISENSE" y su nombre.
- Dado que el usuario hace click en logout, cuando confirma, entonces el token se borra y navega a /login.

## 2. PLAN

**Architecture:** `src/components/layout/Navbar.jsx`. Usado dentro de AppLayout.

**Links de navegación:**
`/dashboard`, `/crops`, `/properties`, `/sensors`, `/telemetry`, `/alerts`, `/notifications`, `/mqtt`, `/profile`

## 3. TASKS

**Task 1: Corregir Navbar.jsx**
Depends on: none
What to build: Actualizar el Navbar existente.
Acceptance criteria:
- Import de AuthContext: `'../../context/AuthContext'`.
- Links usan las rutas correctas del proyecto.
- Botón logout funciona correctamente.