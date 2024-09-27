# Technical Installation Manual: The Republic Project

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Repository Setup](#repository-setup)
4. [Environment Configuration](#environment-configuration)
5. [Supabase Configuration](#supabase-configuration)
6. [External API Configuration](#external-api-configuration)
7. [Deployment and Running](#deployment-and-running)
8. [Troubleshooting](#troubleshooting)
9. [Additional Resources](#additional-resources)

## Introduction

This comprehensive manual provides step-by-step instructions for setting up and deploying The Republic project, which consists of a Next.js frontend and an Express backend within a single repository.

## Prerequisites

Before beginning the installation process, ensure you have the following software installed:

### Software Requirements
- Node.js (v18.0.0 or later)
- Git
- npm or yarn (package managers)

### Installation Resources
- Node.js: [https://nodejs.org/](https://nodejs.org/)
- Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- npm Documentation: [https://docs.npmjs.com/](https://docs.npmjs.com/)
- Yarn Installation: [https://classic.yarnpkg.com/en/docs/install/](https://classic.yarnpkg.com/en/docs/install/)

## Repository Setup

### Cloning the Repository

Open your terminal and run the following commands:

```bash
git clone https://github.com/COS301-SE-2024/The-Republic
cd The-Republic
```

*Note: If you've downloaded the project as a .zip file, extract it and navigate to the project directory instead.*

### Installing Dependencies

#### Frontend (Next.js)

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
# or, if using Yarn
yarn install
```

#### Backend (Express)

Navigate to the backend directory and install dependencies:

```bash
cd ../backend
npm install
# or, if using Yarn
yarn install
```

## Environment Configuration

### Frontend (.env file)

Create a `.env` file in the `frontend` directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=<Your Supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Your Supabase Anon Key>
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<Your Google Maps API Key>
NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_URL=<Azure Content Moderator URL>
NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_KEY=<Azure Content Moderator Key>
NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_URL=<Azure Image Content Safety URL>
NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_KEY=<Azure Image Content Safety Key>
```

### Backend (.env file)

Create a `.env` file in the `backend` directory with the following variables:

```
SUPABASE_URL=<Your Supabase URL>
SUPABASE_SERVICE_ROLE_KEY=<Your Supabase Service Role Key>
SUPABASE_ANON_KEY=<Your Supabase Anon Key>
OPENAI_API_KEY=<Your OpenAI API Key>
```

## Supabase Configuration

### Account Creation
1. Visit [https://supabase.com/](https://supabase.com/) and sign up for an account if you don't have one.
2. Log in to your Supabase account.

### Project Creation
1. Click on "New Project" in the Supabase dashboard.
2. Enter a project name.
3. Choose a secure database password.
4. Select an appropriate region for your project.
5. Click "Create New Project" to finalize.

### Retrieving Credentials
1. Navigate to your project dashboard.
2. Go to "Settings" -> "API" to find:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Go to "Settings" -> "Database" to find:
   - `SUPABASE_SERVICE_ROLE_KEY`

### Database Schema Setup
1. In the Supabase dashboard, navigate to the "SQL Editor".
2. Run the provided schema SQL or manually create the necessary tables and relationships as defined in your project requirements.

## External API Configuration

### Google Maps API
1. Go to the Google Cloud Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project or select an existing one.
3. Enable the Google Maps JavaScript API for your project.
4. Create an API key and restrict it as needed.
5. Copy the API key to your frontend `.env` file.

### Azure Content Moderator
1. Sign in to the Azure portal: [https://portal.azure.com/](https://portal.azure.com/)
2. Create a new Content Moderator resource.
3. Once created, go to the "Keys and Endpoint" section.
4. Copy the endpoint URL and one of the keys to your frontend `.env` file.

### OpenAI API
1. Sign up for an OpenAI account: [https://openai.com/](https://openai.com/)
2. Navigate to the API section and create a new API key.
3. Copy the API key to your backend `.env` file.

## Deployment and Running

### Starting the Backend Server

Navigate to the `backend` directory and start the Express server:

```bash
cd backend
npm start
# or, if using Yarn
yarn start
```

The backend server will typically run on `http://localhost:8080`.

### Starting the Frontend Application

Open a new terminal window, navigate to the `frontend` directory, and start the Next.js application:

```bash
cd frontend
npm run dev
# or, if using Yarn
yarn dev
```

The frontend application will typically run on `http://localhost:3000`.

### Accessing the Application

Open your web browser and navigate to `http://localhost:3000` to access the Next.js frontend.

## Troubleshooting

- Ensure all environment variables are correctly set in both `.env` files.
- Verify that you're using the correct version of Node.js as specified in the `.nvmrc` file (if available).
- Check that all required ports (typically 3000 for frontend and 8080 for backend) are not in use by other applications.
- If you encounter any "Module not found" errors, try deleting the `node_modules` folder and running the installation step again.

## Additional Resources

For more detailed usage instructions, please refer to the User Manual available at:

`/documentation/specifications/UserManualVersion3.md`
