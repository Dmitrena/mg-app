# Builder Stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy necessary files for building the app
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src

# Build the app
RUN npm run build

# Runner Stage
FROM node:18-alpine as runner

WORKDIR /app

# Copy necessary files
COPY package*.json ./

RUN npm ci --only=production

# Copy build output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"]