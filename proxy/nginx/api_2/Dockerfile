FROM node:20-alpine AS base

WORKDIR /src
COPY package.json package-lock.json /src/
EXPOSE 8182

FROM base AS production
ENV NODE_ENV=production
RUN npm ci
COPY . /src
CMD ["node", "index.js"]

FROM base AS dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /src
CMD ["nodemon", "index.js"]
