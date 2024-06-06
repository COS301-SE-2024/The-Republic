<div>
    <img src="../images/gifs/Delivery.gif" alt="Gif" style="width: 1584px; height: 396px;"/>
</div>

---

# Delivery Specification

## Overview

This document covers the delivery aspects of The Republic project, including deployment strategies and post-deployment support.

## Contents

- Introduction
- Deployment Strategies
- Environment Setup
- Continuous Integration/Continuous Deployment (CI/CD)
- Post-Deployment Support
- Rollback Procedures
- Future Plans
- Conclusion

## Introduction

The Republic aims to provide a reliable and scalable platform for citizen engagement. This document outlines the strategies and procedures for deploying the system, ensuring smooth and efficient delivery, and providing post-deployment support.

## Deployment Strategies

- ### Node.js Application Deployment to Heroku

   The backend Node.js application will be deployed to Heroku. This involves setting up the Heroku environment, configuring buildpacks, setting environment variables, and deploying the application code. Heroku provides a scalable and easy-to-manage platform for hosting the backend service.

   - ##### Example CI/CD Job for Heroku Deployment

      ```yaml
      name: Deploy Backend to Heroku

      on:
         ...

      jobs:
      deploy-backend:
         runs-on: ubuntu-latest
         steps:
            - name: Checkout code
            uses: actions/checkout@v3

            - name: Deploy Backend to Heroku
            uses: akhileshns/heroku-deploy@v3.12.12
            with:
               heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
               heroku_app_name: ${{ secrets.HEROKU_BACKEND }}
               heroku_email: ${{ secrets.HEROKU_EMAIL }}
      ```

   - ##### Setting Configuration Variables

      You can set configuration variables in Heroku using the following command syntax:

      ```bash
      heroku config:set -a backend-appname APP_BASE=backend
      heroku config:set -a frontend-appname APP_BASE=frontend
      ```

   - ##### Setting the Git Remote

      Set the git remote for your Heroku app with:

      ```bash
      heroku git:remote -a appname'
      ```

- ### Deployment to DockerHub

   The backend and reverse proxy components will also be containerized and deployed using Docker. Docker images for these components will be built and pushed to Docker Hub. This ensures a consistent runtime environment and facilitates easy scaling and management of these services.

   ###### Example CI/CD Job for Docker Deployment

   ```yaml
   name: Build and Push Docker Images

   on:
      ...

   jobs:
   build-and-push:
      runs-on: ubuntu-latest
      steps:
         - name: Checkout code
         uses: actions/checkout@v3

         - name: Set up Docker Buildx
         uses: docker/setup-buildx-action@v3

         - name: Login to Docker Hub
         uses: docker/login-action@v3
         with:
            username: ${{ secrets.DOCKER_USERNAME }}
            password: ${{ secrets.DOCKER_PASSWORD }}

         - name: Build and push backend Docker image
         run: |
            docker build -t myproject-backend ./backend
            docker tag myproject-backend ${{ secrets.DOCKER_USERNAME }}/myproject-backend:latest
            docker push ${{ secrets.DOCKER_USERNAME }}/myproject-backend:latest

         - name: Build and push reverse proxy Docker image
         run: |
            docker build -t myproject-reverseproxy ./reverseproxy
            docker tag myproject-reverseproxy ${{ secrets.DOCKER_USERNAME }}/myproject-reverseproxy:latest
            docker push ${{ secrets.DOCKER_USERNAME }}/myproject-reverseproxy:latest
   ```

## Environment Setup

Ensure all necessary environment variables and configurations are set up in the respective deployment environments (Heroku, Docker, etc.). Proper environment setup is crucial for the smooth operation of the applications.

- ##### Backend Example `.env`:
   ```env
   SUPABASE_URL={{VALUE}}
   SUPABASE_KEY={{VALUE}}
   PORT=8080
   ```

- ##### Frontend Example `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL={{VALUE}}
   NEXT_PUBLIC_SUPABASE_ANON_KEY={{VALUE}}
   BACKEND_URL={{VALUE}}
   ```

## Continuous Integration/Continuous Deployment (CI/CD)

The project uses GitHub Actions for CI/CD pipelines. The workflows are triggered on specific branches and after successful unit testing. The CI/CD pipelines handle building, testing, and deploying the applications to both Heroku and Docker environments. This ensures that the code is always in a deployable state and reduces manual intervention.

## Post-Deployment Support

- ### Monitoring and Logging

   - Ensure continuous monitoring and logging for the deployed applications to quickly identify and address any issues. Use Heroku's built-in tools and other monitoring services as needed.
   - For Docker deployments, utilize monitoring tools compatible with Docker to track the performance and health of the containers.

- ### Troubleshooting

   - If issues arise during or after deployment, consult the deployment logs and monitoring tools to diagnose and resolve problems promptly.
   - Both Heroku and Docker provide robust logging capabilities to aid in troubleshooting.

## Rollback Procedures

Our goal is to ensure high reliability and availability of The Republic platform. By deploying to AWS and implementing robust scaling strategies, we aim to minimize downtime and ensure that our services are always accessible to users.

## Future Deployment and Management Plans

- ### AWS Hosting

   - We are planning to host our backend Node.js Express server as well as the frontend Next.js app on AWS.
   - This move will allow us to leverage AWS's extensive suite of services for greater flexibility, performance, and scalability.

- ### Horizontal Autoscaling

   - To handle an increasing number of posts and users, we will implement horizontal autoscaling.
   - This strategy will enable our infrastructure to automatically adjust capacity to maintain performance and availability as demand changes, aiming to efficiently handle 10,000+ posts and numerous concurrent users.

- ### Reliability and Availability

   - Our goal is to ensure high reliability and availability of The Republic platform.
   - By deploying to AWS and implementing robust scaling strategies, we aim to minimize downtime and ensure that our services are always accessible to users.

## Conclusion

This document provides the necessary steps and guidelines for deploying and supporting The Republic project. Adhering to these instructions will ensure a smooth and efficient deployment process, leveraging the capabilities of both Heroku and Docker for robust and scalable application hosting. Our future plans for AWS hosting and horizontal autoscaling will further enhance the reliability and availability of our platform.

---

[Back to Full Documentation](./../README.md)

[Back to main](/README.md)

---