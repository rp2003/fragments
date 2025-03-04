# Stage 1: Build Stage
FROM node:22-alpine AS build

# Setting Environment var to production
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY ./src ./src

# Stage 2: Production Stage
FROM node:22-alpine AS production

# Metadata about the image
LABEL maintainer="rp2003 <22riyapuri@gmail.com>"
LABEL description="Fragments node.js microservice"

# Set environment variables
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /app

# Copy built artifacts and dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src

# Copy package.json and package-lock.json from the build stage
COPY --from=build /app/package*.json ./

# Copy additional necessary files with correct ownership
COPY --chown=appuser:appgroup ./tests/.htpasswd ./tests/.htpasswd

# Switch to the non-root user
USER appuser

# Health check command
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:8080/ || exit 1

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
