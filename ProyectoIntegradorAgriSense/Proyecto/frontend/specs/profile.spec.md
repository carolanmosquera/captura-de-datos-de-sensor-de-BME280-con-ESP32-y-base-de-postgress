# Spec: Perfil de Usuario

## 1. SPEC

**Purpose:** Mostrar y permitir editar los datos del perfil del usuario autenticado.

**Users:** Usuarios autenticados.

**Requirements:**
1. Mostrar nombre, email y teléfono actuales.
2. Permitir editar nombre y teléfono.
3. Guardar cambios y actualizar el contexto de auth.

**Edge cases:**
- Error al guardar → mostrar mensaje de error sin perder los datos.

**Acceptance criteria:**
- Dado que el usuario está autenticado, cuando visita /profile, entonces ve sus datos actuales precargados.
- Dado que el usuario edita su nombre y guarda, entonces los cambios se reflejan en el contexto y en la navbar.

## 2. PLAN

**API contracts:**
- `GET /api/users/:id` → `{ id, name, email, phone, status }`
- `PUT /api/users/:id` → body: `{ name, phone }` → 200

**Architecture:** `src/pages/profile/Profile.jsx`. Usa useAuth() para obtener userId y actualizar user en contexto tras guardar.

## 3. TASKS

**Task 1: Crear Profile.jsx**
Depends on: none
What to build: `src/pages/profile/Profile.jsx`
Acceptance criteria:
- Precarga form con datos de useAuth().user.
- handleSubmit llama userService.update(id, { name, phone }) y llama a una función del contexto para actualizar user.
- Muestra mensaje de éxito tras guardar.
- El email no es editable (campo deshabilitado).