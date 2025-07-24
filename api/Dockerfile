FROM node:18-alpine

WORKDIR /app

# Copy only package.json and install dependencies
COPY package.json .
RUN npm install

# Install serve globally to host the built assets
RUN npm i -g serve

# Copy all source files including .env
COPY . .

# Serve the build output
CMD ["serve", "-s", "dist"]