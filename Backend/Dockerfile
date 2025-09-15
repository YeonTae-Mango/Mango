FROM openjdk:21-slim AS builder

WORKDIR /app

COPY app.jar app.jar

FROM openjdk:21-slim

WORKDIR /app

ENV TZ=Asia/Seoul

COPY --from=builder /app/app.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]