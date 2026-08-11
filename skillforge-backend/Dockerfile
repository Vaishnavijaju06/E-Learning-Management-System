FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /src
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
RUN addgroup -S skillforge && adduser -S skillforge -G skillforge \
    && mkdir -p /app/uploads \
    && chown -R skillforge:skillforge /app
COPY --from=build --chown=skillforge:skillforge \
    /src/target/skillforge-backend.jar /app/app.jar

USER skillforge
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
