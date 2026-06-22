# Spec: Gestión de Propiedades

## 1. SPEC

**Purpose:** Permitir ver, crear, editar y eliminar propiedades (fincas) del sistema.

**Users:** Usuarios autenticados (ADMIN principalmente).

**Requirements:**
1. Listar todas las propiedades en una tabla.
2. Crear nueva propiedad con nombre y ubicación.
3. Editar propiedad existente.
4. Eliminar propiedad con confirmación.

**Edge cases:**
- Propiedad con lotes asociados → backend retorna error; mostrar mensaje.
- Nombre vacío → validación client-side.

**Acceptance criteria:**
- Dado que hay propiedades, cuando carga la página, entonces la tabla muestra id y nombre.
- Dado que el usuario crea una propiedad válida, cuando hace submit, entonces aparece en la tabla sin recargar.
- Dado que el usuario elimina, cuando confirma, entonces desaparece de la tabla.

## 2. PLAN

**API contracts:**
- `GET /api/properties` → `[{ id, name, location }]`
- `POST /api/properties` → body: `{ name, location? }` → 201
- `PUT /api/properties/:id` → body: `{ name, location? }` → 200
- `DELETE /api/properties/:id` → 204

## 3. TASKS

**Task 1: Crear Properties.jsx**
Depends on: none
What to build: `src/pages/properties/Properties.jsx` con tabla y formulario modal.
Acceptance criteria:
- Carga propiedades al montar con useEffect.
- handleCreate llama propertyService.create() y actualiza lista sin refetch.
- handleUpdate llama propertyService.update() y actualiza item en estado.
- handleDelete llama propertyService.remove() y filtra item del estado.
- Muestra toast de éxito en cada operación.