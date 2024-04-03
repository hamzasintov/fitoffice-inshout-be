FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Start the server (development mode)
CMD ["npm", "run", "dev"]