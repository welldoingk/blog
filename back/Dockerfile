# Build stage
FROM gradle:7.6.1-jdk17 AS build

WORKDIR /app

# Copy build files
COPY build.gradle settings.gradle ./
COPY src ./src

# Build the application
RUN gradle build --no-daemon

# Production stage
FROM openjdk:17-slim

WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8800

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]