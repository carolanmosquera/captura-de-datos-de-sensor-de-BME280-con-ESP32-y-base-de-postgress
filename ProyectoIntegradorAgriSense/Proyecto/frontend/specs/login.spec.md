# Spec: Login

## 1. SPEC

**Purpose:** Permitir que un usuario registrado inicie sesión con email y contraseña y obtenga acceso autenticado a la plataforma.

**Users:** Cualquier usuario con cuenta en el sistema (rol FARMER o ADMIN).

**Requirements:**
1. El formulario debe tener campo email (tipo email) y campo password (tipo password).
2. Al hacer submit con datos válidos, se guarda el token en localStorage bajo la clave `token` y se redirige a `/dashboard`.
3. Al hacer submit con credenciales inválidas, se muestra un mensaje de error sin borrar el campo email.
4. Si el servidor no responde, se muestra "No se pudo conectar con el servidor".
5. El botón de submit debe mostrar estado de carga mientras espera la respuesta.
6. Existe un enlace a la pantalla de registro.

**Edge cases:**
- Submit con campos vacíos → el formulario debe prevenirlo con validación HTML (required).
- Token ya presente en localStorage al cargar la página → redirigir directamente a `/dashboard`.
- Respuesta 401 del servidor → mostrar "Credenciales incorrectas".
- Respuesta 500 del servidor → mostrar "Error del servidor, intenta más tarde".

**Acceptance criteria:**
- Dado que los campos email y password están llenos con credenciales válidas, cuando el usuario hace click en "Iniciar sesión", entonces localStorage contiene la clave `token` y la URL cambia a `/dashboard`.
- Dado que el usuario ingresa credenciales inválidas, cuando hace submit, entonces se muestra un mensaje de error visible y el campo email conserva su valor.
- Dado que el usuario ya tiene un token válido en localStorage, cuando navega a `/login`, entonces es redirigido a `/dashboard` sin mostrar el formulario.
- Dado que el backend responde 500, cuando hace submit, entonces se muestra "Error del servidor, intenta más tarde".
- Dado que el usuario hace click en el enlace de registro, cuando hace click, entonces la URL cambia a `/register`.

## 2. PLAN

**Architecture:** Nueva página en `src/pages/auth/Login.jsx`. Usa `authService.login()` existente. Usa `AuthContext` para guardar datos del usuario.

**Data model:** No hay modelo nuevo. Request: `{ email, password }`. Response: `{ accessToken, tokenType, user }`.

**API contracts:**
- `POST /api/auth/login`
- Request body: `{ email: string, password: string }`
- Response 200: `{ accessToken: string, tokenType: "Bearer", user: { id, name, email, phone, status } }`
- Response 401: error de credenciales
- Response 500: error de servidor

**Testing strategy:**
- Unit: función `handleSubmit` con mock de `authService.login`
- Integration: flujo completo de form fill → submit → redirect

**Security:** El token se almacena en localStorage. El campo password nunca se loguea.

**Dependencies:** `authService.js` (existente), `AuthContext.jsx` (existente), `React Router DOM v7`.

## 3. TASKS

**Task 1: Crear componente AuthLayout**
Depends on: none
What to build: Componente `src/components/layout/AuthLayout.jsx` que renderiza un contenedor centrado con fondo `--color-bg-base` y una card con `--color-bg-surface` y `--radius-lg`.
Acceptance criteria:
- El componente exporta una función `AuthLayout({ children })`.
- Renderiza un `` con clase `auth-layout` que centra su contenido vertical y horizontalmente.
- Acepta y renderiza `children` dentro de la card.

**Task 2: Crear página Login.jsx**
Depends on: Task 1
What to build: Página `src/pages/auth/Login.jsx` con formulario de login.
Acceptance criteria:
- El componente tiene useState para `{ email, password }`, `loading` (boolean), `error` (string|null).
- Tiene un effect handler que verifica si existe `token` en localStorage y redirige a `/dashboard` si existe.
- El event handler se llama `handleSubmit`.
- Al submit exitoso: llama `authService.login(email, password)`, guarda el token via `AuthContext`, y navega a `/dashboard`.
- Al recibir 401: establece `error = "Credenciales incorrectas"`.
- Al recibir otro error: establece `error = "No se pudo conectar con el servidor"`.
- El botón muestra "Iniciando sesión..." cuando `loading === true` y está deshabilitado.
- El campo email conserva su valor cuando hay error.

**Task 3: Actualizar App.jsx con ruta /login**
Depends on: Task 2
What to build: Agregar redirect inteligente en App.jsx para que `/` redirija a `/dashboard` si hay token, o a `/login` si no.
Acceptance criteria:
- La ruta `/` usa un componente `RootRedirect` que lee `token` de localStorage.
- Si existe token, redirige a `/dashboard`.
- Si no existe token, redirige a `/login`.