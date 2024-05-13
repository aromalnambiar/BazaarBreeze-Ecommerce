# Dockerfile for frontend admin
FROM node:20.9.0-alpine

WORKDIR /app/admin

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Print out the contents of the source directory
RUN ls -l

# Build the application
RUN npm run build

# Print out the contents of the dist directory
RUN ls -l dist

# Expose port
EXPOSE 5173
