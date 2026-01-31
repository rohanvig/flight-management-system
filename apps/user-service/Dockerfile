# Dockerfile — Har service ke root mein yeh file rakh de
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g tsx

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]