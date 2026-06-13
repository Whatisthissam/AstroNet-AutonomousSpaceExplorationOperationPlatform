# Root-level Dockerfile representing monorepo build orchestration.
# This Dockerfile defaults to building and running the AstroNet Backend Server.

FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy root configurations and sub-project definitions
COPY package.json package-lock.json ./
COPY server/package*.json ./server/

# Install server production dependencies from root context
WORKDIR /app/server
RUN npm ci --only=production

# Copy server application files
COPY server/ .

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
