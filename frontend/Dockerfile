# Official Node.js Runtime as the Base Image
FROM node:18

WORKDIR /app

RUN chown -R node:node /app

# Switch to the node user
USER node

COPY --chown=node:node package*.json ./

RUN npm ci

RUN npm install typescript --save-dev

COPY --chown=node:node . .

# Compile TypeScript files
RUN npx tsc

EXPOSE 3000

CMD ["npm", "run", "dev"]