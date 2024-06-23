<div>
    <img src="../images/gifs/FunctionalRequirements.gif" alt="Gif" style="width: 1584px; height: 396px;"/>
</div>

---

# Requirement Specification

## Introduction

This document outlines the development of a Progressive Web App designed for users to post complaints about government service delivery. These posts will be analyzed and visualized to provide insights into government services.

This platform aims to improve citizen interaction with government services, fostering transparency, accountability, and engagement through organized incident reports and data visualization.

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

**Citizen of Pretoria User Story**  
As a citizen of Pretoria, I want to post a complaint about the delayed repair of streetlights in my neighborhood, so that the local government can be aware of and address the issue.

---

#### 📊 User Story 3: Data Visualization and Analytics

---

**3.1. Viewing Data Analytics Visualizations**  
As a user, I want to view analytics based on the data generated on the platform and standard data visualizations in a visually appealing way, so that I can understand the state of different government services.

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
As a user, I want to create an account with my details, so that I can have a personalized experience on the platform.

**5.2: Log In**  
As a user, I want to log in using my credentials, so that I can access my account and interact with the platform.

**5.3: Role Selection**  
As a user, I want to choose my role (general public, government official) during account creation, so that I can have a customized experience based on my role.

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
- **FR4.4**: Users should be able to view each others profile.

---

#### 5. Feed

---

- **FR5.4**: Users can view standard data analytics visualizations.
- **FR5.5**: Users should be able to see data visualization solely based on their filter selected.

---

#### 6. Reporting

---

- **FR6.1**: Users should be able to create a report according to the dates and locations they choose.
- **FR6.2**: Reports should be statistically shown with analytics visualization.

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

## 🎨 Design Patterns

**1. Singleton**: We will use the Singleton Pattern for managing user sessions in the User Management Module and for the Data Analytics Engine in the Data Analytics and Visualization Module. This pattern ensures that a class has only one instance and provides a global point of access to it, which is perfect for managing user sessions and ensuring there is only one active instance of the Data Analytics Engine.

**2. Observer**: We will use the Observer Pattern in the Post Management Module for notifying other parts of the system about changes in posts (like a new post being created). This pattern is beneficial because it allows us to maintain a list of observers which are automatically notified of any changes to the subject. This way, we can easily add or remove observers without modifying the subject's code.

**3. Factory**: We will use the Factory Pattern in the User Management Module for creating different types of users (regular user, municipal official, etc.), and in the Post Management Module for creating different types of posts. This pattern helps us encapsulate the complexities involved in creating different types of users and posts, making the code more maintainable and flexible.

**4. Strategy**: We will use the Strategy Pattern in the Data Analytics and Visualization Module for switching between different data analysis and visualization algorithms. This pattern is beneficial because it allows an algorithm's behavior to be selected at runtime. This way, we can easily add new algorithms or modify existing ones without affecting the context class that uses them.

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

[Back](./../README.md)<br>
[Back to main](/README.md)

---
