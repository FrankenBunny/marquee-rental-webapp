# Use Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY server.js ./
COPY pages/ ./pages/
COPY css/ ./css/
COPY js/ ./js/

# Start the application
CMD ["npm", "start"]
