# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i -g typescript

RUN npm install

COPY . .

# Сборка TypeScript
RUN npm run build

# Открываем порт (если нужен)
EXPOSE 3000

# Запуск (если используешь compiled js в dist)
CMD ["node", "dist/app.js"]
