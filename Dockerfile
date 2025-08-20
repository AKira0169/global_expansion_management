FROM node:22-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
