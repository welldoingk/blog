# Build stage
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# 의존성 캐싱을 위한 파일들 먼저 복사
COPY gradle ./gradle
COPY gradlew build.gradle settings.gradle ./
RUN chmod +x gradlew

# 의존성 다운로드
RUN ./gradlew dependencies --no-daemon

# 소스 복사 및 빌드
COPY src ./src
RUN ./gradlew clean build --no-daemon -x test

# Production stage
FROM openjdk:17-slim

WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

ENV TZ Asia/Seoul

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]