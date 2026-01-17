# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src

RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/seeders ./src/seeders
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/src/config/cli_config.cjs ./src/config/cli_config.cjs

EXPOSE 4004

CMD ["npm", "start"]
