# 1. Используем стабильную Node.js + совместимую с Prisma версию OpenSSL
FROM node:20-alpine3.17

# 2. Устанавливаем OpenSSL 1.1 (необходим для Prisma)
RUN apk add --no-cache openssl1.1-compat

# 3. Рабочая директория
WORKDIR /app

# 4. Копируем зависимости
COPY package*.json ./

# 5. Устанавливаем зависимости
RUN npm install

# 6. Копируем всё приложение
COPY . .

# 7. Компилируем TypeScript
RUN npm run build

# 8. Генерируем Prisma Client
RUN npx prisma generate

# 9. Запускаем миграции при старте контейнера
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/jobs/review.job.js"]
# ===== Bull Board Dashboard =====
FROM node:20-alpine3.17 AS bullboard
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npx", "ts-node", "src/server/bull-board.ts"]
