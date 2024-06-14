Here's the updated API specification with the requested changes:

# API Specification for "The Republic"

This document provides a detailed specification for the API endpoints and functionality to be implemented for "The Republic," a Progressive Web App aimed at enabling users to report and discuss government service delivery issues.

## Base URL

To run the server locally:
```sh
cd backend
npm i
npm run dev
```
The server will be accessible at:
```
http://localhost:8080
```

Once the complete backend is available, it will be deployed and a link to that will be added to this docuet.

## Authentication

All endpoints require authentication using a bearer token. Include the token in the `Authorization` header:
```http
Authorization: Bearer <token>
Content-type: application/json
```
If the token is missing, invalid, or expired, the API will respond with a `401 Unauthorized` status code.

## Endpoints

### 1. Create a New Issue

- **Method:** `POST`
- **Endpoint:** `/api/issues`
- **Description:** Create a new issue.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "location_id": "number", // required
    "category_id": "number", // required
    "content": "string", // required
    "image_url": "string", // optional
    "is_anonymous": "boolean", // required
    "sentiment": "string" // required
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 2. Get All Issues

- **Method:** `GET`
- **Endpoint:** `/api/issues`
- **Description:** Retrieve all issues.
- **Query Parameters:**
  - `sort` (string) - Sort issues by "newest", "oldest", or "most_comments"
  - `category` (number) - Filter issues by category ID
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": [
        {
          "issue_id": "number",
          "user_id": "string",
          "location_id": "number",
          "category_id": "number",
          "content": "string",
          "image_url": "string",
          "is_anonymous": "boolean",
          "created_at": "string",
          "resolved_at": "string",
          "sentiment": "string",
          "user": {
            "user_id": "string",
            "email_address": "string",
            "username": "string",
            "fullname": "string",
            "image_url": "string"
          },
          "category": {
            "name": "string"
          },
          "reactions": [
            {
              "emoji": "string",
              "count": "number"
            }
          ],
          "comment_count": "number",
          "is_owner": "boolean"
        }
      ]
    }
    ```

### 3. Get Issue by ID

- **Method:** `GET`
- **Endpoint:** `/api/issues/{id}`
- **Description:** Retrieve an issue by its ID.
- **Path Parameters:** `id` (number) - ID of the issue
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {
        "issue_id": "number",
        "user_id": "string",
        "location_id": "number",
        "category_id": "number",
        "content": "string",
        "image_url": "string",
        "is_anonymous": "boolean",
        "created_at": "string",
        "resolved_at": "string",
        "sentiment": "string",
        "user": {
          "user_id": "string",
          "email_address": "string",
          "username": "string",
          "fullname": "string",
          "image_url": "string"
        },
        "category": {
          "name": "string"
        },
        "reactions": [
          {
            "emoji": "string",
            "count": "number",
            "user_reacted": "boolean"
          }
        ],
        "comment_count": "number",
        "is_owner": "boolean",
        "is_subscribed": "boolean"
      }
    }
    ```
  - **404 Not Found** (Issue not found)
    ```json
    {
      "success": false,
      "error": "Issue not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 4. Resolve an Issue

- **Method:** `PUT`
- **Endpoint:** `/api/issues/resolve/{id}`
- **Description:** Mark an issue as resolved.
- **Path Parameters:** `id` (number) - ID of the issue
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **404 Not Found** (Issue not found)
    ```json
    {
      "success": false,
      "error": "Issue not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 5. React to an Issue

- **Method:** `POST`
- **Endpoint:** `/api/reactions`
- **Description:** React to an issue with an emoji.
- **Request Body:**
  ```json
  {
    "issue_id": "number", // required
    "user_id": "string", // required
    "emoji": "string" // required
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **200 OK** (Reaction removed)
    ```json
    {
      "success": true,
      "data": {
        "message": "Reaction removed"
      }
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 6. Comment on an Issue

- **Method:** `POST`
- **Endpoint:** `/api/comments`
- **Description:** Comment on an issue.
- **Request Body:**
  ```json
  {
    "issue_id": "number", // required
    "user_id": "string", // required
    "content": "string", // required
    "parent_comment_id": "number" // optional
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 7. Get Comments for an Issue

- **Method:** `GET`
- **Endpoint:** `/api/comments/{issue_id}`
- **Description:** Retrieve all comments for an issue.
- **Path Parameters:** `issue_id` (number) - ID of the issue
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": [
        {
          "comment_id": "number",
          "issue_id": "number",
          "user_id": "string",
          "content": "string",
          "created_at": "string",
          "parent_comment_id": "number",
          "user": {
            "user_id": "string",
            "email_address": "string",
            "username": "string",
            "fullname": "string",
            "image_url": "string"
          }
        }
      ]
    }
    ```
  - **404 Not Found** (Issue not found)
    ```json
    {
      "success": false,
      "error": "Issue not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 8. Get User Profile

- **Method:** `GET`
- **Endpoint:** `/api/users/{user_id}`
- **Description:** Retrieve a user's profile.
- **Path Parameters:** `user_id` (string) - ID of the user
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {
        "user_id": "string",
        "email_address": "string",
        "username": "string",
        "fullname": "string",
        "image_url": "string",
        "posts": [
          {
            "issue_id": "number",
            "content": "string",
            "created_at": "string"
          }
        ],
        "is_owner": "boolean"
      }
    }
    ```
  - **404 Not Found** (User not found)
    ```json
    {
      "success": false,
      "error": "User not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 9. Update User Profile

- **Method:** `PUT`
- **Endpoint:** `/api/users/{user_id}`
- **Description:** Update a user's profile.
- **Path Parameters:** `user_id` (string) - ID of the user
- **Request Body:**
  ```json
  {
    "email_address": "string", // optional
    "username": "string", // optional
    "fullname": "string", // optional
    "image_url": "string" // optional
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide valid fields."
    }
    ```
  - **404 Not Found** (User not found)
    ```json
    {
      "success": false,
      "error": "User not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 10. Subscribe to an Issue

- **Method:** `POST`
- **Endpoint:** `/api/subscriptions/issues`
- **Description:** Subscribe to an issue.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "issue_id": "number" // required
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **409 Conflict** (Already subscribed)
    ```json
    {
      "success": false,
      "error": "User is already subscribed to the issue."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 11. Subscribe to a Category in a Location

- **Method:** `POST`
- **Endpoint:** `/api/subscriptions/categories`
- **Description:** Subscribe to a category in a location.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "category_id": "number", // required
    "location_id": "number" // required
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **409 Conflict** (Already subscribed)
    ```json
    {
      "success": false,
      "error": "User is already subscribed to the category in the location."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 12. Subscribe to a Location

- **Method:** `POST`
- **Endpoint:** `/api/subscriptions/locations`
- **Description:** Subscribe to a location.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "location_id": "number" // required
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **409 Conflict** (Already subscribed)
    ```json
    {
      "success": false,
      "error": "User is already subscribed to the location."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 13. Unsubscribe from an Issue

- **Method:** `DELETE`
- **Endpoint:** `/api/subscriptions/issues`
- **Description:** Unsubscribe from an issue.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "issue_id": "number" // required
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **404 Not Found** (Subscription not found)
    ```json
    {
      "success": false,
      "error": "Subscription not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 14. Unsubscribe from a Category in a Location

- **Method:** `DELETE`
- **Endpoint:** `/api/subscriptions/categories`
- **Description:** Unsubscribe from a category in a location.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "category_id": "number", // required
    "location_id": "number" // required
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **404 Not Found** (Subscription not found)
    ```json
    {
      "success": false,
      "error": "Subscription not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 15. Unsubscribe from a Location

- **Method:** `DELETE`
- **Endpoint:** `/api/subscriptions/locations`
- **Description:** Unsubscribe from a location.
- **Request Body:**
  ```json
  {
    "user_id": "string", // required
    "location_id": "number" // required
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **400 Bad Request** (Invalid input data)
    ```json
    {
      "success": false,
      "error": "Invalid input data. Please provide all required fields."
    }
    ```
  - **404 Not Found** (Subscription not found)
    ```json
    {
      "success": false,
      "error": "Subscription not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 16. Get User's Subscriptions

- **Method:** `GET`
- **Endpoint:** `/api/subscriptions/{user_id}`
- **Description:** Retrieve a user's subscriptions.
- **Path Parameters:** `user_id` (string) - ID of the user
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {
        "issues": [
          {
            "issue_id": "number",
            "content": "string",
            "created_at": "string"
          }
        ],
        "categories": [
          {
            "category_id": "number",
            "name": "string",
            "location_id": "number"
          }
        ],
        "locations": [
          {
            "location_id": "number",
            "name": "string"
          }
        ]
      }
    }
    ```
  - **404 Not Found** (User not found)
    ```json
    {
      "success": false,
      "error": "User not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 17. Get User's Issues

- **Method:** `GET`
- **Endpoint:** `/api/users/{user_id}/issues`
- **Description:** Retrieve a user's issues.
- **Path Parameters:** `user_id` (string) - ID of the user
- **Query Parameters:**
  - `status` (string) - Filter issues by status (e.g., "resolved" or "unresolved")
    - Example: `/api/users/{user_id}/issues?status=resolved`
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": {
        "issues": [
          {
            "issue_id": "number",
            "user_id": "string",
            "location_id": "number",
            "category_id": "number",
            "content": "string",
            "image_url": "string",
            "is_anonymous": "boolean",
            "created_at": "string",
            "resolved_at": "string",
            "sentiment": "string",
            "category": {
              "name": "string"
            },
            "reactions": [
              {
                "emoji": "string",
                "count": "number"
              }
            ],
            "comment_count": "number"
          }
        ],
        "is_owner": "boolean"
      }
    }
    ```
  - **404 Not Found** (User not found)
    ```json
    {
      "success": false,
      "error": "User not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 18. Get User's Notifications

- **Method:** `GET`
- **Endpoint:** `/api/notifications/{user_id}`
- **Description:** Retrieve a user's notifications.
- **Path Parameters:** `user_id` (string) - ID of the user
- **Response:**
  - **200 OK**
    ```json
    {
      "success": true,
      "data": [
        {
          "notification_id": "number",
          "user_id": "string",
          "content": "string",
          "created_at": "string",
          "is_read": "boolean",
          "issue_id": "number",
          "category_id": "number",
          "location_id": "number"
        }
      ]
    }
    ```
  - **404 Not Found** (User not found)
    ```json
    {
      "success": false,
      "error": "User not found."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "success": false,
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

## Rate Limiting

To prevent abuse, rate limiting should be applied to all endpoints. Users are allowed a maximum number of requests per minute. If the limit is exceeded, the API will respond with a `429 Too Many Requests` status code along with an error message:
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```