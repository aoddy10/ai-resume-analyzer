FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port and run
EXPOSE 3000
# Skip build for dev mode and use dev server
CMD ["npm", "run", "dev"]