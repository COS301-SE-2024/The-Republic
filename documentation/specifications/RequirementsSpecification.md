<div style="text-align: center; background-color: #f0f8ff; padding: 20px; border-radius: 10px;">
    <img src="../images/assets/InfiniteLoopers_11.jpeg" alt="Logo"/>
    <h1 style="color: darkblue;">The Republic</h1>
    <p style="color: darkblue;">A Project for EPI-USE Labs</p>
</div>

---

## Introduction
This document outlines the development of a Progressive Web App designed for users to post complaints about government service delivery. These posts will be analysed and visualised to provide insights into government services.

This platform aims to improve citizen interaction with government services, fostering transparency, accountability, and engagement through organised incident reports and data visualisation.

## User Stories and Characteristics

### Intended Users

**1. General Public**: Post complaints or compliments, view and interact with posts.

**2. Government Officials**: Monitor and respond to posts, generate reports.




### User Stories
---
#### ✏️ User Story 1: Posts
---
**1.1. Post Creation**  
As a user, I want to create posts about governmental service delivery shortcomings and interactions, so that I can raise concerns and spread awareness about the status of government services.
  
**1.2. Post Interaction**  
As a user, I want to comment or otherwise interact with other users’ posts, so that I can engage in discussions and share my thoughts.

---
#### 🔍 User Story 2: Post Filtering
---
**2.1. Post Filtering by Department**  
As a user, I want to filter posts based on the department they pertain to, so that I can find specific information relevant to my interests or needs.
  
**2.2. Post Filtering by Date**  
As a user, I want to filter posts based on the date they were posted, so that I can find recent information or look up past incidents.
  
**2.3. Post Filtering by Location/Neighborhood**  
As a user, I want to filter posts based on location or neighborhood, so that I can find information relevant to my local area.

---
#### 📊 User Story 3: Data Visualisation and Analytics
---
**3.1. Viewing Data Analytics Visualisations**  
As a user, I want to view analytics based on the data generated on the platform and standard data visualisations in a visually appealing way, so that I can understand the state of different government services.

---
#### 👤 User Story 4: User Privacy
---
**4.1: User Anonymity**  
As a user, I want the option to post anonymously, so that I can control my privacy on the platform.
 
**4.2: User Profile**  
As a user, I want to share my details, such as username, surname, and email address, when I choose to, so that I can build a public profile on the platform.

---
#### 🔑 User Story 5: User Authentication
---
**5.1: Account Creation**  
As a user, I want to create an account with my details, so that I can have a personalised experience on the platform.

**5.2: Log In**  
As a user, I want to log in using my credentials, so that I can access my account and interact with the platform.

**5.3: Role Selection**  
As a user, I want to choose my role (general public, government official) during account creation, so that I can have a customised experience based on my role.

## Functional Requirements Sorted by Subsystems


---
#### 1. Profile Management
---
- **FR1.1**: Users can manage their profile display name.
- **FR1.2**: Users can choose to post anonymously.
- **FR1.3**: Users can change their profile roles.
- **FR1.4**: Users should be able to update their profile picture.
- **FR1.5**: Users should be able to view their own posts on their profile.

---
#### 2. User Authentication
---
- **FR2.1**: Users can create accounts with a username, email address, and password.
- **FR2.2**: Users can log in using their credentials.
- **FR2.3**: Users can reset their password if forgotten.
- **FR2.4**: Users can update their account details.
- **FR2.5**: Users can select their role during account creation.

---
#### 3. Posting
---
- **FR3.1**: Users can create textual posts about governmental service delivery shortcomings and interactions.
- **FR3.2**: Users should be able to upload media (images) limited to 1 per post.
- **FR3.3**: Users should be able to choose the category of the issue when posting.
- **FR3.4**: Users should be able to pick their location showing their municipality when making a post.

---
#### 4. Interactions
---
- **FR4.1**: Users can comment on other users' posts.
- **FR4.2**: Users can react to other users' posts.
- **FR4.3**: Comments are displayed alongside the respective post.
- **FR4.4**: Government officials should be able to view a user's profile.
- **FR4.5**: Government officials should be able to message any user to follow up.

---
#### 5. Feed
---

- **FR5.1**: Users can filter posts by department, date, or location.
- **FR5.2**: Users should see the feed according to their roles - different roles have different views.
- **FR5.3**: Filtered posts are displayed based on selected criteria.
- **FR5.4**: Users can view standard data analytics visualisations.
- **FR5.5**: Users should be able to see data visualisation solely based on their filter selected.

---
#### 6. Reporting
---
- **FR6.1**: Users should be able to create a report according to the dates and locations they choose.
- **FR6.2**: Reports should be statistically shown with analytics visualisation.

### 📊 Use Case Diagrams
<div>
    <img src="../images/diagrams/authentication.png" alt="authentication use case diagram"/>
</div>

<div>
    <img src="../images/diagrams/profile_management.png" alt="profile use case diagram"/>
</div>

<div>
    <img src="../images/diagrams/posting.png" alt="posting use case diagram"/>
</div>
<div>
    <img src="../images/diagrams/interactions.png" alt="interactions use case diagram"/>
</div>
<div>
    <img src="../images/diagrams/feed.png" alt="feed use case diagram"/>
</div>
<div>
    <img src="../images/diagrams/reporting.png" alt="reporting use case diagram"/>
</div>


## 📄 Service Contracts
- TODO: Detail the service contracts, including the operations, inputs, outputs, and any preconditions or postconditions - will update

## 🔧 Quality Requirements

### 1. Performance 🚀
Performance requirements ensure that the system can handle a high volume of users and interactions without significant latency.
- **FR3.1**: Users can create textual posts about governmental service delivery shortcomings and interactions.
- **FR3.2**: Users should be able to upload media (images) limited to 1 per post.
- **FR4.1**: Users can comment on other users’ posts.
- **FR4.2**: Users can react to other users’ posts.

### 2. Reliability 🛡️
Reliability requirements ensure that the system is available and functional when users need it.
- **FR2.1**: Users can create accounts with a username, email address, and password.
- **FR2.2**: Users can log in using their credentials.
- **FR2.3**: Users can reset their password if forgotten.

### 3. Scalability 📈
Scalability requirements ensure that the system can handle growth in terms of users, data, and complexity.
- **FR5.1**: Users can filter posts by department, date, or location.
- **FR5.2**: Users should see the feed according to their roles - different roles have different views.
- **FR5.3**: Filtered posts are displayed based on selected criteria.

### 4. Security 🔒
Security requirements protect the system and its data from unauthorized access and potential harm.
- **FR2.4**: Users can update their account details.
- **FR2.5**: Users can select their role during account creation.
- **FR4.4**: Government officials should be able to view a user’s profile.
- **FR4.5**: Government officials should be able to message any user to follow up.

### 5. Maintainability 🔧
Maintainability requirements ensure that the system can be easily updated and improved over time.
- **FR1.1**: Users can manage their profile display name.
- **FR1.2**: Users can choose to post anonymously.
- **FR1.3**: Users can change their profile roles.
- **FR1.4**: Users should be able to update their profile picture.

### 6. Usability 🖐️
Usability requirements ensure that the system is easy to use and provides a good user experience.
- **FR1.5**: Users should be able to view their own posts on their profile.
- **FR3.3**: Users should be able to choose the category of the issue when posting.
- **FR3.4**: Users should be able to pick their location showing their municipality when making a post.
- **FR5.4**: Users can view standard data analytics visualisations.
- **FR5.5**: Users should be able to see data visualisation solely based on their filter selected.
- **FR6.1**: Users should be able to create a report according to the dates and locations they choose.
- **FR6.2**: Reports should be statistically shown with analytics visualisation.



## 🏗️ Architectural Patterns
**1. Microservices**: The application will use a microservices architecture to ensure modularity and scalability.
  - **Justification**: Microservices architecture divides the application into smaller, independent services that can be developed, deployed, and scaled individually. This supports performance by allowing independent scaling of services experiencing high load, enhances scalability by distributing the load across multiple services, and increases modularity by separating concerns into different services.

**2. Monolithic Architecture**: This pattern involves a single, unified codebase.
  - **Justification**: A monolithic architecture is simpler to develop and deploy initially, as it involves a single codebase and deployment pipeline. It can be a suitable choice for smaller applications or when development resources are limited. However, it may face challenges in scalability and maintainability as the application grows.

## 🎨 Design Patterns
**1. Singleton**: Ensuring a single instance of key classes, such as database connection managers.

**2. Observer**: For implementing real-time updates in the post feed and notifications.

**3. Factory**: To create different types of posts and visualisations dynamically.

**4. Decorator**: For adding functionality to posts such as tagging and filtering without modifying the original object.

## ⚖️ Constraints
1. The system must not follow a serverless model.
2. The system should not be cloud-native and must be able to run on one or more Linux VMs.
3. All libraries/services used must be open source.

## 🛠️ Technology Requirements

**1. Frontend**
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**2. Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

**3. Data Science**
- ![Python](https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
- ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)

**4. Database**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

### Appendix: Changes to Previous Sections
*Note: This is where we will put old sections which have changed. Keep this document updated incrementally as changes are made to the project.*
