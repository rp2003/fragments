# Stage 1: Build Stage
FROM node:22-alpine AS build


# Metadata about the image
LABEL maintainer="rp2003 <22riyapuri@gmail.com>"
LABEL description="Fragments node.js microservice"

# Setting Environment var to production
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable color when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Set ENV for Production Environment 
ENV NODE_ENV=test

# Create a non-root user
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

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




# Create a non-root user
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /app

# Copy built artifacts and dependencies from the build stage
COPY --from=build /app /app
COPY ./src ./src

# Copy additional necessary files with correct ownership
COPY ./tests/.htpasswd ./tests/.htpasswd

# Switch to the non-root user
#USER appuser

RUN apk add --no-cache \
    tini=0.19.0-r3 \
    curl=8.12.1-r1 \
    shadow=4.16.0-r1

# Health check command

# Expose the application port
#EXPOSE 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:8080/ || exit 1


# Start the application
CMD ["npm", "start"]
