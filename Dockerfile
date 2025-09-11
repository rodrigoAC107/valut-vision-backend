FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa final para correr en modo desarrollo con nodemon
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app ./

# Instalar nodemon global para el comando en docker-compose
RUN npm install -g nodemon

# Expongo el puerto que usa tu backend
EXPOSE 3000

CMD ["nodemon", "--watch", "src", "--exec", "ts-node", "src/server.ts"]

