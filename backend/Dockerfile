# Use Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Clear npm cache to avoid "idealTree" error
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
