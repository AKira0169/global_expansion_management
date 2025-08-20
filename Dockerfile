FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]