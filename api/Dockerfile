# LTS as of 2025-07-17
FROM node:22.16

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

RUN ls -l dist

CMD ["npm", "start"]