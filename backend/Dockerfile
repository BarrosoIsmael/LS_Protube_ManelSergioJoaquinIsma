# Usa una imagen base de Amazon Corretto 21
FROM amazoncorretto:21

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo JAR generado
COPY target/protube-back-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto del backend
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]