// src/components/UserIssues/UserIssues.tsx
"use client";

import React from "react";
import Issue from "../Issue/Issue";
import { Issue as IssueType, User } from "@/lib/types";

const UserIssues: React.FC = () => {
  const mockUser: User = {
    user_id: "1",
    email_address: "jane@example.com",
    fullname: "Jane Doe",
    username: "@janedoe",
    image_url: "https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg",
  };

  const issues: IssueType[] = [
    {
      issue_id: 1,
      user_id: mockUser.user_id,
      location_id: 1,
      category_id: 1,
      image_url: "",
      is_anonymous: false,
      content: "The new feature is not working as expected. I tried to use the sorting function on the dashboard, but it's not sorting the items correctly. Can someone please look into this?",
      sentiment: "Negative",
      created_at: "2024-06-07T10:00:00Z",
      resolved_at: null,
      user: mockUser,
      category: { id: 1, name: "Bug" } as any,
      reactions: [{ type: "like", count: 2 }, { type: "dislike", count: 1 }] as any[],
    },
    {
      issue_id: 2,
      user_id: mockUser.user_id,
      location_id: 1,
      category_id: 2,
      image_url: "",
      is_anonymous: false,
      content: "Great job on the latest update! It's much faster now.",
      sentiment: "Positive",
      created_at: "2024-06-06T15:30:00Z",
      resolved_at: "2024-06-07T09:00:00Z",
      user: mockUser,
      category: { id: 2, name: "Feedback" } as any,
      reactions: [{ type: "like", count: 5 }] as any[],
    },
  ];

  return (
    <div className="px-4">
      <h2 className="text-xl font-semibold mb-4">Issues</h2>
      {issues.map((issue) => (
        <Issue key={issue.issue_id} issue={issue} />
      ))}
    </div>
  );
};

export default UserIssues;