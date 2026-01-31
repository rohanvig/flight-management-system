FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g tsx

COPY . .

EXPOSE 4003

CMD ["npm", "run", "dev"]