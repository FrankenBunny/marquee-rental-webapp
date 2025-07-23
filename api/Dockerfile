FROM node:22.16

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev  # Prod image = inga devDependencies

COPY . .

RUN npx tsc -p tsconfig.build.json  # ⬅️ Bygg bara src/, inga tester

CMD ["node", "dist/src/server.js"]

