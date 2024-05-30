import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const IssueInputBox = () => {
  const [content, setContent] = useState('');

  const handleIssueSubmit = () => {

    console.log('Posting:', content);
    setContent('');
  };

  return (
    <Card className="mb-4 w-full bg-background border-primary rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="What is happening?!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow mr-4"
          />
          <Button onClick={handleIssueSubmit} disabled={!content}>
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueInputBox;