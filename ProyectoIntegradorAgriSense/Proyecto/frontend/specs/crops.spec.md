# Spec: Gestión de Cultivos

## 1. SPEC

**Purpose:** Permitir al usuario ver, crear, editar y eliminar cultivos registrados en el sistema.

**Users:** Usuarios autenticados (ADMIN preferentemente).

**Requirements:**
1. Listar todos los cultivos en una tabla.
2. Crear un nuevo cultivo con nombre (obligatorio), nombre científico y descripción.
3. Editar un cultivo existente.
4. Eliminar un cultivo con confirmación.

**Edge cases:**
- Nombre vacío al crear → validación client-side, no enviar request.
- Delete de cultivo con lotes asociados → el backend retorna 409 o 500; mostrar mensaje adecuado.

**Acceptance criteria:**
- Dado que hay cultivos, cuando carga la página, entonces la tabla muestra id, nombre, nombre científico.
- Dado que el usuario llena el form de nuevo cultivo con nombre válido, cuando hace submit, entonces el cultivo aparece en la tabla sin recargar.
- Dado que el usuario edita un cultivo, cuando guarda, entonces los cambios se reflejan en la tabla.
- Dado que el usuario elimina un cultivo, cuando confirma el modal, entonces el cultivo desaparece de la tabla y aparece un toast de éxito.
- Dado que el usuario intenta crear un cultivo sin nombre, cuando hace submit, entonces el request no se envía y se muestra "El nombre es obligatorio".

## 2. PLAN

**API contracts:**
- `GET /api/crops` → `[{ id, name, scientificName, description }]`
- `POST /api/crops` → body: `{ name, scientificName?, description? }` → 201
- `PUT /api/crops/:id` → body: `{ name, scientificName?, description? }` → 200
- `DELETE /api/crops/:id` → 204

## 3. TASKS

**Task 1: Crear cropService.js**
Depends on: none
What to build: `src/services/cropService.js` con funciones `getAll`, `getById`, `create`, `update`, `remove`.
Acceptance criteria:
- Todas usan apiClient, no axios directo.
- `remove` no retorna valor (delete 204).
- Ninguna usa .then()/.catch().

**Task 2: Crear CropFormModal.jsx**
Depends on: none
What to build: Modal con formulario para crear/editar cultivos.
Acceptance criteria:
- Acepta props: `isOpen`, `onClose`, `onSubmit`, `initialData` (null para crear, objeto para editar).
- Tiene campos: name (required), scientificName, description.
- Al submit, llama `onSubmit(formData)` — no hace el fetch internamente.
- Cuando `isOpen === false`, no renderiza nada (return null).

**Task 3: Crear Crops.jsx**
Depends on: Task 1, Task 2
What to build: Página completa de gestión de cultivos.
Acceptance criteria:
- Carga cultivos al montar.
- El event handler `handleCreate` llama `cropService.create()` y actualiza la lista con el nuevo cultivo sin refetch.
- El event handler `handleUpdate` llama `cropService.update()` y actualiza el item en el array de estado.
- El event handler `handleDelete` llama `cropService.remove()` y filtra el item del array de estado.
- Muestra toast de éxito en cada operación exitosa.