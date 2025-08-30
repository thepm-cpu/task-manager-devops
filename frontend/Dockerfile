FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Create public directory and ensure files are in the right place
RUN mkdir -p public
RUN cp -f src/* public/ 2>/dev/null || true

EXPOSE 3000

CMD ["npm", "start"]