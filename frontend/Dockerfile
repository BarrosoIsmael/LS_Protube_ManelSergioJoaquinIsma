# Usa una imagen base de Node.js versión 22
FROM node:22.9.0

# Define el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia las dependencias del frontend primero para aprovechar el caché de Docker
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install

# Luego copia el resto del código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación (asegúrate de usar un servidor estático adecuado si es para producción)
CMD ["npm", "run", "preview"]
