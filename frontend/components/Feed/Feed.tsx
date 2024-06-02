import React from 'react';
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";

const mockIssues = [
  {
    id: 1,
    author: 'John Doe',
    username: '@johndoe',
    content: 'Did anyone else just hear that blast? Electricity gone in Brooklyn',
    timestamp: '6 sec ago',
    category: 'Water',
    sentiment: 'Angry',
    numberofcomments: 5
  },
];

const Feed = () => {
  return (
    <div className="w-full px-6">
      <IssueInputBox/>
      {mockIssues.map((issue) => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

export default Feed;
