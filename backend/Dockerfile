FROM node:22-alpine

# Install build dependencies for bcrypt if needed (alpine needs this sometimes)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Use a non-root user for security
USER node

EXPOSE 5000

# The command is handled by docker-compose.yml, 
# but we provide a default just in case.
CMD ["npm", "run", "dev"]