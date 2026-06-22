# Spec: Autenticación — Register

## 1. SPEC

**Purpose:** Permitir que un nuevo usuario cree una cuenta en el sistema.

**Users:** Visitantes sin cuenta (futuro FARMER o ADMIN).

**Requirements:**
1. Formulario con campos: nombre, email, teléfono (opcional), contraseña, confirmar contraseña.
2. Al registrarse exitosamente, guardar token y redirigir a /dashboard.
3. Validar que contraseña tenga mínimo 6 caracteres y coincida con confirmación.
4. Mostrar error si el email ya existe (409).

**Edge cases:**
- Contraseñas no coinciden → mensaje client-side, no enviar request.
- Email duplicado → mostrar "Ya existe un usuario con ese correo".

**Acceptance criteria:**
- Dado que el usuario llena todos los campos válidos, cuando hace submit, entonces se guarda el token y navega a /dashboard.
- Dado que las contraseñas no coinciden, cuando hace submit, entonces se muestra error y no se envía request.
- Dado que el email ya existe, cuando hace submit, entonces se muestra "Ya existe un usuario con ese correo".

## 2. PLAN

**Architecture:** `src/pages/auth/Register.jsx`. Usa `AuthContext.register()`.

**API contracts:**
- `POST /api/auth/register` → body: `{ name, email, password, phone? }` → 201 `{ accessToken, user }`
- Response 409: email duplicado

**Dependencies:** `authService.js`, `AuthContext.jsx`, React Router DOM v7.

## 3. TASKS

**Task 1: Corregir Register.jsx**
Depends on: none
What to build: Correcciones al Register.jsx existente.
Acceptance criteria:
- Import de AuthContext usa ruta correcta: `'../../context/AuthContext'`.
- Tras registro exitoso, navega a `/dashboard` (no a `/`).
- Muestra error específico para 409.