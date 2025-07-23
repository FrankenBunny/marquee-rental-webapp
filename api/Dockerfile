<<<<<<< HEAD
# 🛠️ Steg 1: Build stage
FROM node:22.16 AS builder
=======
FROM node:22.16

>>>>>>> 0599621b645fa7e4b2588262b37f217b22dee580
WORKDIR /app
COPY package*.json ./
<<<<<<< HEAD
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
=======
RUN npm install --omit=dev  # Prod image = inga devDependencies

COPY . .

RUN npx tsc -p tsconfig.build.json  # ⬅️ Bygg bara src/, inga tester

CMD ["node", "dist/src/server.js"]

>>>>>>> 0599621b645fa7e4b2588262b37f217b22dee580
