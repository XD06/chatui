# Stage 1: Build the application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Express
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy server files
COPY server/ ./server/

# Copy built static files from the build stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start the Express server with ES modules support
CMD ["node", "--experimental-json-modules", "server/index.js"] 