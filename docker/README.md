# Docker Compose Documentation

This documentation provides a guide to creating Docker images using `docker-compose`. It includes the necessary code snippets and instructions for setting up and running a multi-service application using Docker Compose.

## Prerequisites

- Docker installed on your machine.
- Docker Compose installed on your machine.
- Basic knowledge of Docker and Docker Compose.

## Project Structure

Your project directory should have the following structure:

```
project-directory/
├── docker-compose.yaml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── ...
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── ...
└── reverseproxy/
    ├── Dockerfile
    ├── nginx.conf
    ├── ...
```

## Docker Compose Configuration

Create a `docker-compose.yaml` file in the /docker directory from the root project directory with the following content it it doesn't exist:

```yaml
version: '3'
services:
  frontend:
    image: infiniteloopers-frontend-app:v0
    build: ./../frontend
    ports:
      - '3000:3000'
    depends_on:
      - backend
    environment:
      - REACT_APP_BACKEND_URL=http://backend:8080
  backend:
    image: infiniteloopers-backend-server:v0
    build: ./../backend
    ports:
      - '8080:8080'
  reverseproxy:
    image: infiniteloopers-reverseproxy:v0
    build: ./../reverseproxy
    ports:
      - 80:80
    depends_on:
      - backend
      - frontend
```

## Dockerfile for Each Service

### Frontend Service

Create a `Dockerfile` in the `frontend` directory:

```Dockerfile
# frontend/Dockerfile
FROM node:18

WORKDIR /app

RUN chown -R node:node /app

# Switch to the node user
USER node

COPY --chown=node:node package*.json ./

RUN npm install

RUN npm install typescript --save-dev

COPY --chown=node:node . .

RUN npx tsc

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Backend Service

Create a `Dockerfile` in the `backend` directory:

```Dockerfile
# backend/Dockerfile
FROM node:18

WORKDIR /app

RUN chown -R node:node /app

# Switch to the node user
USER node

COPY --chown=node:node package*.json ./

RUN npm install

RUN npm install typescript --save-dev

COPY --chown=node:node . .

RUN npx tsc

EXPOSE 8080

CMD ["npm", "run", "dev"]
```

### Reverse Proxy Service

Create a `Dockerfile` in the `reverseproxy` directory:

```Dockerfile
# reverseproxy/Dockerfile
FROM nginx:1.21.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf
```

Create a `nginx.conf` file in the `reverseproxy` directory with your Nginx configuration.

## Building and Running the Application

To build and run your multi-service application, follow these steps:

1. **Build the Docker images**:

   ```sh
   docker-compose build
   ```

2. **Start the application**:

   ```sh
   docker-compose up
   ```

This will start all the services defined in the `docker-compose.yaml` file.

## Accessing the Services

- **Frontend**: Access the frontend application at `http://localhost:3000`.
- **Backend**: Access the backend application at `http://localhost:8080`.
- **Reverse Proxy**: Access the reverse proxy at `http://localhost`.

## Conclusion

This documentation provides a step-by-step guide to setting up and running a multi-service application using Docker Compose. By following these instructions, you can easily build, run, and manage the Dockerized applications.