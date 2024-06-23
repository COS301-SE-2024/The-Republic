<div>
    <img src="../images/gifs/FunctionalRequirements.gif" alt="Gif" style="width: 1584px; height: 396px;"/>
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
- **FR4.4**: Users should be able to view each others profile.

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

