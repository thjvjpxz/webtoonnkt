# Multi-stage build for Spring Boot
FROM maven:3.9.4-eclipse-temurin-21 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy sources and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime image
FROM eclipse-temurin:21-jre AS runner
WORKDIR /app

# Create non-root user
RUN groupadd -r spring \
    && useradd -r -g spring spring

# Copy built jar
COPY --from=builder /app/target/*.jar app.jar
RUN chown spring:spring app.jar

# Switch to non-root
USER spring

# Expose application port
EXPOSE 8080

# JVM tuning and run
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+UseG1GC", \
  "-XX:+UseStringDeduplication", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", \
  "app.jar"]
