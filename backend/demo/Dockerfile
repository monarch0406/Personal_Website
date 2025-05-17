# 1. Build 階段
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /app

# 先複製 mvnw、.mvn 與 pom.xml，加速 cache
COPY mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml ./

# 下載依賴（offline 模式更快）
RUN mvn dependency:go-offline -B

# 再複製原始程式碼並打包
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Run 階段
FROM eclipse-temurin:17
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
