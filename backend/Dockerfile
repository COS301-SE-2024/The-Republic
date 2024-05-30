# Official Node.js Runtime as the Base Image
FROM node:18

WORKDIR /app

RUN chown -R node:node /app

# Switch to the node user
USER node

COPY --chown=node:node package*.json ./

RUN npm install

# Install TypeScript as a dev dependency
USER root
RUN npm install -g typescript --save-dev
USER node

COPY --chown=node:node . .

# Compile TypeScript files
RUN npx tsc

EXPOSE 8080

CMD ["npm", "run", "start"]
