# Dockerfile para despliegue en Easypanel (Astro Node Standalone con inicializador de DB)

# Paso 1: Base de Node.js (Usamos Node 22 para cumplir con el requisito de Astro 7)
FROM node:22-alpine AS base
WORKDIR /app

# Paso 2: Instalación de dependencias (Usamos npm install para sincronizar correctamente el lockfile)
COPY package*.json ./
RUN npm install

# Paso 3: Copia de archivos y construcción de la aplicación
COPY . .
RUN npm run build

# Exponer el puerto por defecto de Astro Node (Cambiado a 3000 para cumplir con el estándar de Easypanel)
EXPOSE 3000

# Variables de entorno por defecto para producción
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Ejecutar el script de inicio para auto-inicializar la base de datos sqlite en volumen
CMD ["node", "./scripts/start-server.js"]
