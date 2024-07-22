# Issue resolution Sub System.

Issue resolution is a key part of the app, that will not only show us the state of the republic as to what is being fixed, but will also
unlock the data and help us make sense of it. This sub system will interact with other sub systems including:
- Clustering sub system
- Gamification sub system
- Notifications

In order for the issue resolutions sub system to work to its full capacity, it is crucial that the clustering and the gamification sub systems
be planned together with it. This document will be touching on how they work together with the assumption that more detail for those sub systems is
noted elsewhere.

## Objective:

To manage the resolution of issues within the app, namely self-resolution and external resolution by users on the platform.

## 1. Self resolution:

### Overview:
- User Action: The user marks their issue as resolved.
- System Action: Check for other unresolved issues in the same cluster.
- User Notification: Notify other users in the same cluster to confirm or decline the resolution.

### Steps:

1. **User Marks Issue as Resolved**:
   - User resolves their issue through the app interface.
   - Through the interface the user can then provide more details if they choose to do so, such as:
        - Who resolved the issue?
            - "I fixed the issue"
            - "I don't know who fixed the issue"
            - "It was fixed by X"
   - The issue will then move to a resolved state.
   - The user will then get their points.

2. **Identify Cluster**:
   - Retrieve the cluster ID of the resolved issue from the database.
   - If there is none, the process ends.

3. **Find Clustered Issues**:
   - Query the database to get all unresolved issues within the same cluster.

4. **Notify Cluster Members**:
   - Send notifications to users who have unresolved issues in the same cluster.
   - Include details of the resolved issue and a prompt to confirm or decline.

5. **User Response**:
   - Users receive notifications and respond with either confirmation or decline the resolution.
   - Implement a mechanism for users to confirm or decline directly through the notification or app interface.

6. **Update Issue Status**:
   - If a majority of cluster members confirm, update the issue status to "Resolved."
   - The user who logged the self resolution will then receive more points.
   - If declined or if no response is received within a defined time, revert the issue status to "Unresolved."


## **2. External Resolution**

**Process Overview:**

- **User Action**: External resolution requires proof and additional information.
- **System Action**: Collect and review the proof and additional details.
- **Review Process**: Cluster members review the resolution details.

**Steps:**

1. **Submit External Resolution**:
   - The user resolving the issue submits proof and additional information (e.g., who resolved it, associated political party, state organization, pictures).
   - A resolution record is entered into the resolution table and is associated with the issue_id.

2. **Collect Proof and Information**:
   - Store the submitted proof and additional details in the resolutions table.

3. **Notify Issue Owner and Cluster Members**:
   - Notify cluster members of the external resolution submission.
   - Provide access to view the submitted proof and additional information.

4. **Review and Decision**:
   - Allow cluster members to review the provided information.
   - Provide options to accept or decline the external resolution.

5. **Update Issue Status**:
   - If the resolution is accepted by a majority, update the issue status to "Resolved."
   - The user who then logged the resolution is awarded the necessary points.
   - If declined or if no response is received within a defined time, revert the issue status to "Unresolved."
   - The user who logged the resolution is the penalized with the necessary points, and given a possible timed ban.


---

## Resolution Types

**1. Self-Resolution**

- **Types**:
  - **"I fixed the problem"**: The user claims they have resolved the issue themselves.
  - **"I don’t know who fixed it"**: The user indicates the issue was resolved, but they don’t know who did it.
  - **"It was fixed by X"**: The user specifies that another individual (X) resolved the issue.

**2. External Resolution**

- **Types**:
  - **"I fixed the problem"**: An external party claims responsibility for fixing the issue.
  - **"It’s fixed, I don’t know who fixed it"**: The external party acknowledges the issue is resolved but doesn't know who resolved it.
  - **"It was resolved by X"**: The external party specifies who resolved the issue.

## Proposed changes to the database schema:

It is mainly the introduction of a resolutions table.

**1. Resolution Table Schema**
This is not the final schema for the table, just an idea of the type of information it could store.
- **Schema**:

| Column Name           | Data Type          | Description                                           |
|-----------------------|---------------------|-------------------------------------------------------|
| `id`                  | UUID / SERIAL       | Unique identifier for each resolution                |
| `issue_id`            | UUID / INTEGER      | Foreign key referencing the `issues` table            |
| `resolver_id`         | UUID / INTEGER      | ID of the user *or entity* resolving the issue        |
| `self_resolution_type` | ENUM('fixed_by_user', 'fixed_by_others', 'fixed_unknown') | Type of self-resolution (optional based on context) |
| `external_resolution_type` | ENUM('fixed_by_user', 'fixed_by_others', 'fixed_unknown') | Type of external resolution (optional based on context) |
| `status`              | ENUM('pending', 'accepted', 'declined', 'reverted') | Resolution status                                  |
| `proof`               | TEXT                | Proof or additional information (for external resolutions) |
| `proof_image`         | TEXT                | URL                                                   |
| `submitted_at`        | TIMESTAMP           | Timestamp when the resolution was submitted          |
| `reviewed_at`         | TIMESTAMP           | Timestamp when the resolution was reviewed           |
| `notes`               | TEXT                | Additional notes or comments on the resolution       |

## Edge cases to consider
 - What happens if both an external and self resolution are submitted?
    - Which takes precedence?
    - If the external resolution is accepted by a majority, will the self resolution be automatically accepted?
    - If the external resolution is rejected by a majority, will the self resolution be automatically rejected or accepted, or discarded?
    - If the self resolution is rejected by a majority, will the external resolution be automatically rejected?
    - If the self resolution is accepted by a majority, will the external resolution be automatically accepted?


 - How to stop abuse of the system?
    - Limit the number of rejected external resolutions a user can make?
        - What if the limit for rejections is 5 but the user has solved way more than that and they just happen to get some wrong?
        - Permanent bans?
