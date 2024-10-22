# Organisations Subsystem Specification

## 📝 Requirement Specification

### 🌟 Introduction
This document outlines the development of a new Organizations subsystem. This subsystem will allow users to create, join, and manage organizations.

### 👥 User Stories and Characteristics

#### 🏷️ Intended Users
1. General Public: Create organizations, join existing ones, and participate in organization activities.
2. Organization Admins (Political, Community, State, etc.): Manage organization details, members, and generate reports.

#### 📚 User Stories

##### ✏️ User Story 1: Organization Creation and Management
1.1. Create Organization
As a user, I want to create a new organization with details such as name, description, logo, and website, etc. so that I can establish a community around shared interests or locations.

1.2. Update Organization Details
As an organization admin, I want to update the organization's details, so that I can keep the information current and relevant.

1.3. Delete Organization
As an organization admin, I want to delete the organization when it's no longer needed, ensuring all related data is properly handled - ensure that no other existing data is deleted by mistake when an org is deleted.

##### 🔑 User Story 2: Membership Management
2.1. Join Organization
As a user, I want to request to join, or join openly, an existing organization.

2.2. Set Join Policy
As an organization admin, I want to set and change the join policy (open or request to join), so that I can control how new members are added.

2.3. Manage Join Requests
As an organization admin, I want to approve or reject join requests of users for organizations with a "request to join" policy, so that I can curate the organization's membership.

2.4. Remove Members
As an organization admin, I want to remove members from the organization when necessary, so that I can maintain the integrity of the organization if needs be.

##### 📊 User Story 3: Organization Interaction and Reporting
3.1. View Organizations
As a user, I want to view a list of organizations I can join (press join button), so that I can find relevant groups to participate in.

3.2. Generate Reports
As an organization admin, I want to generate detailed reports about the organization's activities, including issues raised and individual user contributions, so that I can track the organization's impact and member engagement, as the data can be valuable.

### ⚙️ Functional Requirements Sorted by Inter Subsystems

1. Organization Management
   FR1.1: Users can create new organizations with a name, description, logo, and website.
   FR1.2: Organization creators are automatically assigned as admins.
   FR1.3: Organization admins can update organization details.
   FR1.4: Organization admins can delete the organization, with proper handling of related data.

2. Membership Control
   FR2.1: Organizations have a configurable join policy (open or request to join).
   FR2.2: Users can join or request to join organizations based on the join policy.
   FR2.3: Organization admins can approve or reject join requests.
   FR2.4: Organization admins can remove members from the organization.
   FR2.5: Organization admins can assign or revoke admin status for members.

3. User Interface
   FR3.1: Provide a form for users to create new organizations.
   FR3.2: Display a list of organizations that users can join.
   FR3.3: Implement an admin dashboard for organization management.
   FR3.4: Show appropriate join options based on an organization's join policy.

4. Notifications
   FR4.1: Send notifications for successful organization creation.
   FR4.2: Notify users of changes in their membership status.
   FR4.3: Alert admins of pending join requests and other administrative actions.

5. Reporting
   FR5.1: Generate detailed reports (Excel, PDF?) for organizations, including:
      - A sheet for different issues within the organization
      - A sheet for individual user contributions within the organization

6. Security and Validation
   FR6.1: Implement proper authentication and authorization for all organization-related actions.
   FR6.2: Validate all input for organization creation and updates, including name uniqueness - cannot have a random person creating an organisation called ANC, etc.
