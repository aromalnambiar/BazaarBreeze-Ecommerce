# Use a lightweight Node.js image as the base
FROM node:20.9.0-alpine

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire Node.js server code
COPY . .


# Expose the port on which the Node.js server will run
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
