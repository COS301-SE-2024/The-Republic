# Node.js Express Backend with TypeScript Documentation

<div style="width: 100%; height: 40%; border-radius:20px; background-color: black; margin: 20px 0;">
    <img src="../documentation/images/express.png" alt="Backend Documentation" style="width: 100%; height: auto; max-height: 50%;">
</div>

> This document provides comprehensive information on the Node.js Express backend application written in TypeScript. The application uses Express for handling HTTP requests and Supabase for authentication and PostgreSQL database operations.

## Table of Contents

1. [Coding Standards](#coding-standards)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [API Endpoints](#api-endpoints)
   - [GET /](#get-)
   - [GET /users](#get-users)
5. [Using Supabase](#using-supabase)
   - [Authentication](#authentication)
   - [Database Operations](#database-operations)
6. [Project Structure](#project-structure)
7. [Running the Project](#running-the-project)

## Coding Standards:

- Maintaining high coding standards is crucial for the success of The Republic project. We have a document which provides guidelines and best practices for ensuring a clean, readable, and maintainable codebase.
- Please read the document here: [Coding Standards](./../documentation/specifications/CodingStandards.md)
- Read this for the Full Documentation: [Documentation](./../documentation/README.md)

## Installation

Follow these steps to install the application:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/COS301-SE-2024/The-Republic.git
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install TypeScript (if not already installed globally):**

   ```bash
   npm install -g typescript
   ```

## Configuration

1. **Create a `.env` file in the root directory and add your Supabase URL and anon key:**

   ```env
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Modify the `supabaseClient.ts` file to use environment variables:**

   ```typescript
   import { createClient } from "@supabase/supabase-js";
   import dotenv from "dotenv";

   dotenv.config();

   const supabaseUrl = process.env.SUPABASE_URL as string;
   const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

   const supabase = createClient(supabaseUrl, supabaseAnonKey);

   export default supabase;
   ```

## Example: API Endpoints

### GET /

**Description:** Returns a welcome message.

**Endpoint:** `GET /`

**Response:**

- `200 OK`: Returns a welcome message.

**Example:**

```json
{
  "message": "Hello, Express!"
}
```

### GET /users

**Description:** Retrieves a list of users from the Supabase database.

**Endpoint:** `GET /users`

**Response:**

- `200 OK`: Returns a list of users.
- `500 Internal Server Error`: Returns an error message if the request fails.

**Example:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
]
```

## Example: Using Supabase

### Authentication

Supabase provides user authentication through various methods. For this project, ensure you have configured authentication in your Supabase project. Refer to the [Supabase Auth Documentation](https://supabase.io/docs/guides/auth) for more details.

### Database Operations

Supabase allows you to perform CRUD operations on your PostgreSQL database. This application uses the Supabase client to fetch user data.

**Example Usage:**

In `users.ts`:

```typescript
import { Router, Request, Response } from "express";
import supabase from "./supabaseClient";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    res.status(500).send(error.message);
  } else {
    res.json(data);
  }
});

export default router;
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── exampleController.ts
│   ├── routes/
│   │   └── exampleRoute.ts
│   ├── types/
│   │   └── exampleTypes.ts
│   ├── services/
│   │   └── supabaseClient.ts
│   ├── middleware/
│   │   └── exampleMiddleware.ts
│   ├── utils/
│   │   └── exampleUtil.ts
│   ├── app.ts
│   └── server.ts
├── public/
├── node_modules/
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── Dockerfile
```

- **src/server.ts:** Main server file.
- **src/users.ts:** User route handler.
- **src/supabaseClient.ts:** Supabase client setup.
- **public/:** Compiled JavaScript files.

## Running the Project

- #### Running The Development Server:

  ```bash
  cd backend
  npm i
  npm run dev
  ```

- #### Running the Application locally in a Docker Container

  - Changing working directory to the backend folder
    ```bash
    cd backend
    ```
  - Building the application locally:

    ```bash
    docker build -t backend_the_republic .
    ```

  - Running the application locally:
    ```bash
    docker run -p 8080:8080 -d backend_the_republic
    ```
  - Stopping and Removing all Containers Locally:

    ```bash
    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)
    ```

  - Removing all Unused Docker Objects:
    ```bash
    docker system prune -a
    ```

> Open [http://localhost:8080](http://localhost:8080) with your browser to see the result. The page auto-updates as you edit the file.

---

[Read Project Documentation](./../documentation/README.md)

---

These documents collectively ensure that The Republic project is developed, tested, and delivered to the highest standards, providing a robust platform for citizen engagement and government accountability.

Feel free to contact us at: [infiniteloopers@gmail.com](mailto:infiniteloopers@gmail.com)

<details>
    <summary> :lock: Secret Message</summary>
    <br/>
    <p>Thank you for opening this, Have a great day! :smile:</p>
</details>

---
