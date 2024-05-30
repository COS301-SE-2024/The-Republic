import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



interface IssueProps {
  issue: {
    id: number;
    author: string;
    username: string;
    content: string;
    timestamp: string;
  };
}

const Issue: React.FC<IssueProps> = ({ issue }) => {
  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="flex items-center ">
          <div className="pr-2">
            <Avatar >
              <AvatarImage src="https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="font-bold">{issue.author}</div>
          <div className="ml-2 text-sm text-gray-600">{issue.username}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{issue.content}</p>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">{issue.timestamp}</div>
      </CardFooter>
    </Card>
  );
};

export default Issue;
