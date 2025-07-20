# Stage 1: Install dependencies & build the app
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Stage 2: Use minimal runtime image
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app /app

# Expose the app port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
