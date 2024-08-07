Here is a comprehensive technical installation manual that includes instructions on accessing APIs, configuring Supabase, and other necessary setup details:

---

## Technical Installation Manual for Next.js and Express Project

### Introduction
This project consists of a Next.js frontend and an Express backend, both housed within a single repository. The frontend application is responsible for the user interface and client-side rendering, while the backend server manages API endpoints and business logic. To get the project up and running, you'll need to set up both environments and configure necessary services, such as Supabase and external APIs.

### Prerequisites

**Software Requirements:**
1. **Node.js (v18.0.0 or later)**: Required for both Next.js and Express. Includes npm for managing dependencies.
2. **Git**: Required for cloning the repository.
3. **npm or yarn**: Package managers for managing JavaScript dependencies.

**Installation Resources:**
- [Node.js Download](https://nodejs.org/)
- [Git Download](https://git-scm.com/downloads)
- [npm Documentation](https://docs.npmjs.com/)
- [Yarn Installation](https://classic.yarnpkg.com/en/docs/install/)

### Installation

**1. Clone the Repository**

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/COS301-SE-2024/The-Republic
cd The-Republic
```

Note that this process is not necessary if you simply downloaded the latest release of the project as a .zip.

**2. Install Dependencies**

The repository contains two directories, `frontend` and `backend`. Install dependencies for both.

**Frontend (Next.js):**

Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm i
```

or, if using Yarn:

```bash
yarn install
```

**Backend (Express):**

Navigate to the `backend` directory and install dependencies:

```bash
cd ../backend
npm i
```

or, if using Yarn:

```bash
yarn install
```

**3. Configure Environment Variables**

**Frontend (Next.js):**

In the `frontend` directory, create the `.env` file with the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase instance.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for accessing Supabase.
- `NEXT_PUBLIC_BACKEND_URL`: The URL of the backend API (e.g., `http://localhost:8080`).
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your API key for Google Maps.
- `NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_URL`: The URL for Azure Content Moderator API for text processing.
- `NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_KEY`: The key for Azure Content Moderator API.
- `NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_URL`: The URL for Azure Content Moderator API for image safety.
- `NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_KEY`: The key for Azure Content Moderator API for image safety.

**Backend (Express):**

In the `backend` directory, create the `.env` file with the following environment variables:

- `SUPABASE_URL`: The URL of your Supabase instance.
- `SUPABASE_SERVICE_ROLE_KEY`: The service role key for Supabase.
- `SUPABASE_ANON_KEY`: The anonymous key for accessing Supabase.

**Sample `.env` file:**

**Frontend:**

```env
NEXT_PUBLIC_SUPABASE_URL=redacted
NEXT_PUBLIC_SUPABASE_ANON_KEY=redacted
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=redacted
NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_URL=redacted/ProcessText/Screen/?classify=True
NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_KEY=5b0ba05889984c429ec15e4e2f5b4b11
NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_URL=redacted
NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_KEY=redacted
```

**Backend:**

```env
SUPABASE_URL=redacted
SUPABASE_SERVICE_ROLE_KEY=redacted
SUPABASE_ANON_KEY=redacted
OPENAI_API_KEY=redacted
```
The project will not run without these setup. Ensure you get all the keys you need.

### Configuring Supabase

1. **Create a Supabase Account:**
   - Go to [Supabase](https://supabase.com/) and sign up for an account if you don’t have one.

2. **Create a New Project:**
   - After logging in, click on "New Project".
   - Enter a project name, select a database password, and choose a region.

3. **Get Your Supabase Credentials:**
   - Navigate to the project dashboard.
   - Under the "Settings" tab, go to "API" to find your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   - Under the "Settings" tab, go to "Database" to find your `SUPABASE_SERVICE_ROLE_KEY`.

4. **Set Up the Database Schema:**
   - Use the Supabase SQL Editor to run the provided schema or manually create the necessary tables and relationships as defined in your project requirements.


### Deployment/Running

**1. Start the Backend Server**

Navigate to the `backend` directory and start the Express server:

```bash
cd backend
npm start
```

or, if using Yarn:

```bash
yarn start
```

The backend server will typically run on `http://localhost:8080` (or as specified in your `.env` file).

**2. Start the Frontend Application**

Open a new terminal tab or window, navigate to the `frontend` directory, and start the Next.js application:

```bash
cd frontend
npm run dev
```

or, if using Yarn:

```bash
yarn dev
```

The frontend application will typically run on `http://localhost:3000`.

**3. Accessing the Application**

Open your web browser and navigate to `http://localhost:3000` to access the Next.js frontend. It will communicate with the Express backend running on `http://localhost:8080`.

### Additional Notes

- Ensure you have the correct version of Node.js as specified in the `.nvmrc` file (if available).
- Verify that all environment variables are correctly set to avoid configuration issues.
- Make sure `.env` files are added to `.gitignore` to prevent sensitive information from being committed to version control.

For more detailed usage instructions, please refer to the [User Manual](/documentation/specifications/UserManualVersion3.md).

