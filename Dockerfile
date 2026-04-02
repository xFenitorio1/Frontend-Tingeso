# Imagen base
FROM node:22

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Puerto que usa tu app
EXPOSE 5173

# Comando para iniciar
CMD ["npm", "run", "dev", "--", "--host"]