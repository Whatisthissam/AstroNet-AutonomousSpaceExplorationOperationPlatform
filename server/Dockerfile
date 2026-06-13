# Use official lightweight Node.js Alpine base image
FROM node:18-alpine

# Set node environment to production
ENV NODE_ENV=production

# Set working directory inside container
WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy server code
COPY . .

# Create logs directory and assign permissions (security best practice)
RUN mkdir -p logs && chown -R node:node /app

# Run container as non-privileged node user for security
USER node

# Expose backend API port
EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]
