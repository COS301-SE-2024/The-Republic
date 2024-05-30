import React from 'react';
import Issue from "../Issue/Issue"

const mockIssues = [
  {
    id: 1,
    author: 'John Doe',
    username: '@johndoe',
    content: 'Did anyone else just hear that blast? Electricity gone in Brooklyn',
    timestamp: '6 sec ago',
  },
];

const Feed = () => {
  return (
    <div>
      {mockIssues.map((issue) => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

export default Feed;
