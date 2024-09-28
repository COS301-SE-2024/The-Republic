# 📝 Requirement Specification for The Republic

## 🌟 Introduction

This document outlines the development of a Progressive Web App designed for users to post complaints about government service delivery, create and manage organizations, and engage with other citizens. These posts and organizational activities will be analyzed and visualized to provide insights into government services and citizen engagement.

The Republic platform aims to improve citizen interaction with government services, fostering transparency, accountability, and engagement through organized incident reports, data visualization, and community-driven organizations.

## 👥 User Stories and Characteristics

### 🏷️ Intended Users

**1. General Public**: Post complaints or compliments, view and interact with posts, create and join organizations.

**2. Government Officials**: Monitor and respond to posts, generate reports.

**3. Organization Admins**: Manage organization details, members, and generate organization-specific reports.

### 📚 User Stories

#### ✏️ User Story 1: Posts

**1.1. Post Creation**  
As a user, I want to create posts about governmental service delivery shortcomings and interactions, so that I can raise concerns and spread awareness about the status of government services.

**1.2. Post Interaction**  
As a user, I want to comment or otherwise interact with other users' posts, so that I can engage in discussions and share my thoughts.

**1.3. Complaint Post**  
As a user, I want to create a post about a burst pipe in my area, choose my location, type my complaint, attach an image, and choose to remain anonymous, so that I can report the issue without revealing my identity.

**1.4. React to Posts**  
As a user, I want to react to my post or another user's post, so that I can express my agreement or support for the issue.

**1.5. Mark Issue as Resolved**  
As a user, I want to mark a post as resolved once the municipality has solved the issue, so that others know the problem has been addressed.

#### 🔑 User Story 2: User Authentication

**2.1: Account Creation**  
As a user, I want to create an account with my details, so that I can have a personalized experience on the platform.

**2.2: Log In**  
As a user, I want to log in using my credentials, so that I can access my account and interact with the platform.

**2.3: Sign Up**  
As a new user, I want to be able to create an account so that I can be able to post, react, and interact on the platform.

#### 📊 User Story 3: Data Visualization and Analytics

**3.1. Viewing Data Analytics Visualizations and Reports**  
As a user, I want to view analytics based on the data generated on the platform and standard data visualizations in a visually appealing way, so that I can understand the state of different government services.

**3.2. Province-Wide Visualizations**  
As a user, I want to see visualizations showing issues faced across all provinces, and by pressing on the circles representing different categories, I can identify which areas have the most issues, by the size of the circles.

**3.3. Progress Reports**  
As a user, I want to see reports that show the progress of most issues over the past weeks or years in different formats like bar graphs and line graphs, so that I can track improvements or ongoing problems.

#### 👤 User Story 4: User Privacy

**4.1: User Anonymity**  
As a user, I want the option to post anonymously, so that I can control my privacy on the platform.

**4.2: User Profile**  
As a user, I want to share my details, such as username, surname, and email address, when I choose to, so that I can build a public profile on the platform.

**4.3. Profile Management**  
As a user, I want to navigate to my profile where it will show my details, issues, and what has been resolved either by me or the municipality, so that I can keep track of my activity on the platform.

**4.4. Edit Profile**  
As a user, I want to edit my profile display name, bio, and profile picture by navigating to the edit profile section and making the necessary updates, so that my profile reflects my current information.

#### 📋 User Story 5: Subscriptions and Filtering

**5.1. Issue Subscription**  
As a user, I want to subscribe to an issue or a category if I am interested in that specific issue because it is in my area and I need updates on it, so that I can stay informed.

**5.2. Feed Sorting**  
As a user, I want to sort my feed of issues from oldest to newest or by most comments, so that I can view the posts in the order that interests me most.

**5.3. Feed Filtering**  
As a user, I want to filter my feed by category, such as electricity or water, so that I can easily find posts related to my interests or concerns.

#### 🔍 User Story 6: Clustering of Issues

**6.1. Issue Clustering**  
As a user, I want related issues to be grouped together based on content, time, location, and category, so that I can easily find and understand similar issues.

**6.2. Cluster Assignment**  
As a user, I want new issues to be assigned to the nearest existing cluster, if appropriate, so that similar issues are grouped dynamically.

#### 🎮 User Story 7: Gamification

**7.1. Earn Points for Resolving Issues**  
As a user, I want to earn points for resolving issues, so that I am motivated to contribute positively to the platform.

**7.2. Earn Points for Posting Issues**  
As a user, I want to earn points for posting issues, so that I am encouraged to report problems.

**7.3. Earn Points for Comments and Reactions**  
As a user, I want to earn points for leaving comments and reacting to issues, so that I am motivated to engage with the community.

**7.4. Leaderboard**  
As a user, I want to see a leaderboard of top users based on scores, so that I can track my progress and compete with others.

#### 🛠️ User Story 8: Issue Resolution

**8.1. Self-Resolution**  
As a user, I want to mark my issue as resolved, provide details about the resolution, and earn points, so that I can update the community on the status of the issue.

**8.2. External Resolution**  
As a user, I want to submit proof and additional information for external resolution, so that I can ensure the issue is properly documented and resolved.

**8.3. Review and Confirm Resolutions**  
As a user, I want to review and confirm or decline resolutions of issues in my cluster, so that I can ensure the accuracy and validity of resolved issues.

#### 🏢 User Story 9: Organization Creation and Management

**9.1. Create Organization**  
As a user, I want to create a new organization with details such as name, description, logo, and website, so that I can establish a community around shared interests or locations.

**9.2. Update Organization Details**  
As an organization admin, I want to update the organization's details, so that I can keep the information current and relevant.

**9.3. Delete Organization**  
As an organization admin, I want to delete the organization when it's no longer needed, ensuring all related data is properly handled.

#### 👥 User Story 10: Membership Management

**10.1. Join Organization**  
As a user, I want to request to join, or join openly, an existing organization.

**10.2. Set Join Policy**  
As an organization admin, I want to set and change the join policy (open or request to join), so that I can control how new members are added.

**10.3. Manage Join Requests**  
As an organization admin, I want to approve or reject join requests of users for organizations with a "request to join" policy, so that I can curate the organization's membership.

**10.4. Remove Members**  
As an organization admin, I want to remove members from the organization when necessary, so that I can maintain the integrity of the organization if needs be.

#### 📊 User Story 11: Organization Interaction and Reporting

**11.1. View Organizations**  
As a user, I want to view a list of organizations I can join (press join button), so that I can find relevant groups to participate in.

**11.2. Generate Organization Reports**  
As an organization admin, I want to generate detailed reports about the organization's activities, including issues raised and individual user contributions, so that I can track the organization's impact and member engagement.

## ⚙️ Functional Requirements Sorted by Subsystems

#### 1. Profile Management

- **FR1.1**: Users can manage their profile display name.
- **FR1.2**: Users can choose to post anonymously.
- **FR1.3**: Users can change their profile roles.
- **FR1.4**: Users can update their profile picture.
- **FR1.5**: Users can view their posts on their profile.
- **FR1.6**: Users can edit their bio information.

#### 2. User Authentication

- **FR2.1**: Users can create accounts with a username, email address, and password.
- **FR2.2**: Users can log in using their credentials.
- **FR2.3**: Users can update their account details.
- **FR2.4**: Users can sign up and create an account.

#### 3. Posting

- **FR3.1**: Users can create textual posts about governmental service delivery shortcomings and interactions.
- **FR3.2**: Users can upload media (images) limited to 1 per post.
- **FR3.3**: Users can choose the category of the issue when posting.
- **FR3.4**: Users can pick their location showing their municipality when making a post.
- **FR3.5**: Users can mark their posts as resolved.

#### 4. Interactions

- **FR4.1**: Users can comment on other users' posts.
- **FR4.2**: Users can react to other users' posts.
- **FR4.3**: Comments are displayed alongside the respective post.
- **FR4.4**: Users can subscribe to the issue or category of that post.
- **FR4.5**: Users can react to their posts.

#### 5. Feed

- **FR5.1**: Users can sort the posts on their feed from oldest to newest, or by most comments.
- **FR5.2**: Users can filter the posts on their feed by category, such as electricity, water, etc.
- **FR5.3**: Users can subscribe to specific issues or categories to receive updates.

#### 6. Reporting and Analytics

- **FR6.1**: Users should be able to create a report according to the dates and locations they choose.
- **FR6.2**: Reports should be statistically shown with analytics visualization.
- **FR6.3**: Users can view standard data analytics visualizations according to the province.
- **FR6.4**: Users can zoom into an issue analytics circle to see how huge it is in that area.

#### 7. Clustering

- **FR7.1**: Implement clustering of issues based on content, time, location, and category.
- **FR7.2**: Automatically assign new issues to existing clusters, if appropriate.

#### 8. Gamification

- **FR8.1**: Users can earn points for posting issues.
- **FR8.2**: Users can earn points for resolving issues.
- **FR8.3**: Users can earn points for comments and reactions.
- **FR8.4**: Users can view their total points.
- **FR8.5**: Users can view a leaderboard.

#### 9. Issue Resolution

- **FR9.1**: Users can mark an issue as resolved.
- **FR9.2**: Users can submit proof and additional information for external resolution.
- **FR9.3**: Users can review and confirm or decline resolutions of issues in their cluster.
- **FR9.4**: Users can provide details about the resolution when marking an issue as resolved.

#### 10. Organization Management

- **FR10.1**: Users can create new organizations with a name, description, logo, and website.
- **FR10.2**: Organization creators are automatically assigned as admins.
- **FR10.3**: Organization admins can update organization details.
- **FR10.4**: Organization admins can delete the organization, with proper handling of related data.

#### 11. Membership Control

- **FR11.1**: Organizations have a configurable join policy (open or request to join).
- **FR11.2**: Users can join or request to join organizations based on the join policy.
- **FR11.3**: Organization admins can approve or reject join requests.
- **FR11.4**: Organization admins can remove members from the organization.
- **FR11.5**: Organization admins can assign or revoke admin status for members.

#### 12. Organization User Interface

- **FR12.1**: Provide a form for users to create new organizations.
- **FR12.2**: Display a list of organizations that users can join.
- **FR12.3**: Implement an admin dashboard for organization management.
- **FR12.4**: Show appropriate join options based on an organization's join policy.

#### 13. Organization Notifications

- **FR13.1**: Send notifications for successful organization creation.
- **FR13.2**: Notify users of changes in their membership status.
- **FR13.3**: Alert admins of pending join requests and other administrative actions.

#### 14. Organization Reporting

- **FR14.1**: Generate detailed reports (Excel, PDF) for organizations, including:
  - A sheet for different issues within the organization
  - A sheet for individual user contributions within the organization

#### 15. Organization Security and Validation

- **FR15.1**: Implement proper authentication and authorization for all organization-related actions.
- **FR15.2**: Validate all input for organization creation and updates, including name uniqueness.

