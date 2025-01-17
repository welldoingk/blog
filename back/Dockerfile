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

# curl 설치
RUN apt-get update && apt-get install -y curl && apt-get clean

# Build 단계에서 생성된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 환경 변수 설정
ENV TZ Asia/Seoul

# 애플리케이션이 사용하는 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]