FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle App Source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]