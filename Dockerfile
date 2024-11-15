# Use the latest Node.js image as the base
FROM node:lts

# Install Python (using the latest Python version)
RUN apt-get update && apt-get install -y python3 python3-pip

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port (3000 in this case)
EXPOSE 3000

# Command to start the Node.js app
CMD ["npm", "start"]
