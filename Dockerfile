# Dockerfile for Fragments Microservice

# node version
FROM node:22-alpine AS build

# Setting Environment var to production
ENV NODE_ENV = production

# Set the working directory inside the container to /app
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files into the image
# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy src to /app/src/
# Copy source file
COPY ./src ./src


# Stage 2: Production Stage
FROM node:22-alpine AS production

# Metadata about the image
LABEL maintainer="rp2003 <22riyapuri@gmail.com>"
LABEL description="Fragments node.js microservice"

# Set environment variables for the service
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Use the working directory
WORKDIR /app

# Copy package.json and package-lock.json files into the image
# Copy only package files first for better caching
COPY package*.json ./


# Copy the installed node_modules from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy only necessary application files to the production image
COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

# Health check for the service
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:8080/ || exit 1

# We run our service on port 8080
# Expose the service port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]