# Usa una imagen base de Amazon Corretto 21
FROM amazoncorretto:21

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo JAR generado
COPY target/protube-back-0.0.1-SNAPSHOT.jar app.jar

# Establece las variables de entorno necesarias
ENV ENV_PROTUBE_STORE_DIR=/home/jcatanzariti/protube/store
ENV ENV_PROTUBE_DB=protube
ENV ENV_PROTUBE_DB_USER=admin
ENV ENV_PROTUBE_DB_PWD=1234

# Expone el puerto del backend
EXPOSE 8080

# Mount volume for the store directory
VOLUME /store

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]