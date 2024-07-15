### Plan for Implementing a Gamification System in the App

#### Objective:
Introduce a gamification system to enhance user engagement by rewarding or penalizing users based on their actions within the app.

#### Overview:
We will implement a point-based scoring system where users earn or lose points based on specific actions. The main aim of this system is to encourage positive behaviors (e.g., resolving issues) and discourage negative behaviors (e.g., falsely resolving issues). This will be especially useful in the next phase of our project when we introduce organizations. These could have points associated with their members as well.

#### Point System individual users:
- **Positive Actions:**
  - Resolving an issue:
    - 100 points for first issue resolved then 50 points thereafter.
  - Posting issues
    - 50 points for first issue resolved then 20 points thereafter.
  - Leaving a comment on an open issue: +10 points
  - Reacting to an issue: +5 points

- **Negative Actions:**
  - Falsely resolving someone else's issue: -75 points
  - Breaking community guidelines: -200 points

#### Implementation Details:

1. **Database Changes:**
   - Add a `user_score` field to the `users` table to track each user's score.
   - Add a `points_history` table to log point transactions (e.g., action, points awarded/penalized, timestamp).

2. **Backend Logic:**
   - Update the `issueService` and `commentService` to include logic for awarding and penalizing points.
   - Create function(s) to handle point transactions, ensuring they are logged in the `points_history` table.

3. **Frontend Changes:**
   - Display user scores on their profile pages.
   - Show notifications or messages when points are awarded or penalized.
   - Add a leader-board to show top users based on scores. This leader-board can be toggled to the users
   local area or they can see where they rank in the whole country. (Possible feature, but not necessary in the short term) 

4. **User Feedback and Notifications:**
   - Implement real-time notifications to inform users of their score changes.
   - Provide feedback messages upon completing actions (e.g., "You earned 50 points for resolving an issue!").
