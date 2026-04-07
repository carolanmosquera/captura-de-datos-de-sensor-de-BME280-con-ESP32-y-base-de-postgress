# Etapa 1: Compilación con la versión confirmada RC-5
FROM maven:4.0.0-rc-5-eclipse-temurin-17 AS build
WORKDIR /app

# Al usar Root Directory: aplicacionJava/sensores en Render
# estas rutas son relativas a esa carpeta
COPY pom.xml .
COPY src ./src

# Compilación saltando tests para agilizar el despliegue
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/sensores-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]