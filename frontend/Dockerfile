# Build stage using Node.js
FROM node:23-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install --force

# Copy all source files from frontend directory
COPY ./frontend ./

# Build the application
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine

# Copy built files from build stage to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]