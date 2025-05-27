# Dockerfile for Next.js (with Turbopack)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the port used by Next.js
EXPOSE 3000

# Use turbopack for development
CMD ["npm", "run", "dev", "--", "--turbo"]
