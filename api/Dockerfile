# 🛠️ Steg 1: Build stage
FROM node:22.16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 🚀 Steg 2: Runtime stage
FROM node:22.16
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/src/server.js"]
