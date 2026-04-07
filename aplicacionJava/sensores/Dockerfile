# Etapa 1: Compilación con Maven 4
FROM maven:4.0.0-rc-2-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Asegúrate de que el nombre del .jar coincida con el de tu pom.xml
COPY --from=build /app/target/sensores-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]