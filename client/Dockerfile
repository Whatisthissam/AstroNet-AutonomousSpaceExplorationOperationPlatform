# ==========================================
# STAGE 1: Build the React Application
# ==========================================
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./

# Install packages clean and fast
RUN npm ci

# Copy the rest of the application files
COPY . .

# Pass build args to make the API URL available to Vite build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Run the production build via Vite
RUN npm run build

# ==========================================
# STAGE 2: Serve application with Nginx
# ==========================================
FROM nginx:1.25-alpine

# Copy built application from Stage 1 to Nginx HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
