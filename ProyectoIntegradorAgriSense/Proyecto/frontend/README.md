# Frontend - AgriSense

Frontend desarrollado con React + Vite para el sistema AgriSense.

Esta interfaz permite visualizar los datos capturados por sensores ESP32 y controlar la captura de datos mediante comunicación con el backend.

## Tecnologías usadas

- React
- Vite
- JavaScript
- CSS
- React Router DOM

## Requisitos

Antes de ejecutar el proyecto, tener instalado:

- Node.js
- npm

Para verificar:

```bash
node -v
npm -v
````

## Instalación

Ubicarse en la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Si el proyecto usa navegación entre páginas, instalar React Router DOM:

```bash
npm install react-router-dom
```

## Ejecutar el proyecto

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una URL similar a:

```bash
http://localhost:5173/
```

Abrir esa dirección en el navegador.

## Estructura principal

```bash
src/
├── components/
│   ├── MqttController.jsx
│   ├── SensorDataList.jsx
│   └── Navbar.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Sensors.jsx
│   ├── Reports.jsx
│   └── Alerts.jsx
│
├── services/
├── hooks/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Funcionalidades

* Home principal tipo dashboard.
* Visualización de datos capturados por sensores ESP32.
* Control de captura mediante MQTT.
* Menú de navegación entre páginas.
* Páginas para sensores, reportes y alertas.

## Comandos útiles

Ejecutar en desarrollo:

```bash
npm run dev
```

## Notas

Para que la visualización de datos funcione correctamente, el backend debe estar ejecutándose y disponible en la URL configurada dentro de los servicios del frontend.

Si aparece una pantalla en blanco, revisar la consola del navegador con:

```bash
F12 → Console
```

y verificar que los componentes y rutas estén correctamente importados.

```
