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
- Conclusion

## Introduction

The Republic aims to provide a reliable and scalable platform for citizen engagement. This document outlines the strategies and procedures for deploying the system, ensuring smooth and efficient delivery, and providing post-deployment support.

# Node.js Application Deployment to Heroku

This README provides a step-by-step guide on how to deploy a Node.js application to Heroku.

## Prerequisites

Ensure you have the following prerequisites installed and set up on your local machine:

- Node.js and npm
- Heroku CLI
- A Heroku account

## Setting Configuration Variables

You can set configuration variables in Heroku using the following command syntax:

```bash
heroku config:set -a infiniteloopers-backend-server APP_BASE=backend
```

This command sets the `APP_BASE` environment variable to `backend` for the app `infiniteloopers-backend-server`.

## Adding Buildpacks

You can manage buildpacks for your Heroku app using these commands:

To add a buildpack:

```bash
heroku buildpacks:add -a 'infiniteloopers-backend-server' -i 1 heroku-community/multi-procfile
```

To remove a buildpack:

```bash
heroku buildpacks:remove heroku-community/multi-procfile -a 'infiniteloopers-backend-server'
```

## Setting the Git Remote

Set the git remote for your Heroku app with:

```bash
heroku git:remote -a 'infiniteloopers-backend-server'
```

## Steps

1. **Initialize Your Node.js Application**: Ensure your Node.js application is initialized with a `package.json` file. If not, create one by running `npm init`.

2. **Create a Start Script**: Add a `start` script in your `package.json` file under the `scripts` section. This script should start your server. For example:

   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

   Replace `server.js` with the main file of your application.

3. **Configure the Port**: Heroku dynamically assigns your app a port, so modify your server file to use the port number set by Heroku:

   ```javascript
   const express = require("express");
   const app = express();
   const port = Number(process.env.PORT) || 8080;

   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
   ```

4. **Initialize a Git Repository**: If your project is not already a Git repository, initialize it by running `git init`.

5. **Commit Your Changes**: Commit all changes by running `git add .` and `git commit -m "Initial commit"`.

6. **Create a New Heroku App**: Create a new Heroku app by running `heroku create`.

7. **Push to Heroku**: Push your code to Heroku by running `git push heroku master`.

   ```bash
   git subtree push --prefix backend heroku feature/devops:master
   ```

8. **Open the App**: Open your deployed app in the browser by running `heroku open`.

## Deployment To Docker

Refer to the [Docker Deployment Documentation](./../../docker/README.md) located in the docker directory for detailed instructions.

## Troubleshooting

If you encounter any issues during deployment, view the logs by running:

```bash
heroku logs --tail
```

---

[Back to Full Documentation](./../README.md)<br>

[Back to main](/README.md)

---
