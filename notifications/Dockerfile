FROM node:18-alpine as runner

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]