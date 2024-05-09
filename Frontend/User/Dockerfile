# Use a lightweight Node.js image as the base
FROM node:20.9.0-alpine

# Set the working directory inside the container
WORKDIR /app/user

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React application code
COPY . .

EXPOSE 5173

# Start Nginx server
CMD ["npm", "run", "dev"]