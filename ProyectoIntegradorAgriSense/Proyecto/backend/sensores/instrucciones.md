# Ejecución del Backend con MQTT (Mosquitto)

## Requisitos previos

Antes de iniciar el backend se necesita:

* Java 17
* Maven
* Mosquitto MQTT Broker
* PostgreSQL o Neon configurado

---

# 1. Instalar Mosquitto en Windows

Descargar Mosquitto desde:

```text
https://mosquitto.org/download/
```

Instalar normalmente.

---

# 2. Iniciar Mosquitto

Abrir PowerShell como administrador:

```powershell
cd "C:\Program Files\mosquitto"
.\mosquitto.exe -v
```

Si todo funciona correctamente aparecerá algo similar a:

```text
Opening ipv4 listen socket on port 1883.
Opening ipv6 listen socket on port 1883.
mosquitto version 2.x running
```

> Importante: dejar esta terminal abierta mientras se ejecuta el backend.

---

# 3. Verificar configuración MQTT del backend

En `application.properties`:

```properties
mqtt.broker.url=tcp://localhost:1883
mqtt.client.id=spring-boot-sensores
mqtt.topic.commands=sensores/commands
```

---

# 4. Ejecutar el backend

Abrir una nueva terminal en:

```text
backend/sensores
```

Ejecutar:

## PowerShell

```powershell
$env:SPRING_PROFILES_ACTIVE="local"
$env:SERVER_PORT="8081"
$env:MAVEN_OPTS="-Xms64m -Xmx512m"

mvn spring-boot:run
```

## CMD

```bat
set SPRING_PROFILES_ACTIVE=local
set SERVER_PORT=8081
mvn spring-boot:run
```

---

# 5. Verificar que el backend inició correctamente

Abrir:

```text
http://localhost:8081/mvc/telemetry
```

o:

```text
http://localhost:8081/api/rest/telemetry
```

---

# 6. Probar comandos MQTT

## Pausar nodo

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/commands/node/1/pause" -Method POST
```

## Reanudar nodo

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/commands/node/1/resume" -Method POST
```

## Pausar todos los nodos

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/commands/all/pause" -Method POST
```

## Reanudar todos los nodos

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/commands/all/resume" -Method POST
```

---

# Problemas comunes

## Error: Connection refused

El broker MQTT no está iniciado.

Solución:

```powershell
.\mosquitto.exe -v
```

---

## Error: There is insufficient memory for the Java Runtime Environment

Cerrar aplicaciones pesadas como:

* Docker Desktop
* Chrome
* IntelliJ
* máquinas virtuales

Y ejecutar Maven con menor memoria:

```powershell
$env:MAVEN_OPTS="-Xms64m -Xmx512m"
```

---

# Flujo completo de ejecución

1. Iniciar Mosquitto
2. Iniciar backend Spring Boot
3. Iniciar frontend React
4. Encender ESP32 receptor
5. Encender ESP32 emisor
6. Verificar datos en dashboard web
