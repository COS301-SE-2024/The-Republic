import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from 'lucide-react';



interface IssueProps {
  issue: {
    id: number;
    author: string;
    username: string;
    content: string;
    timestamp: string;
    category: string;
    sentiment: string;
    numberofcomments: number;
    
  };
}

const Issue: React.FC<IssueProps> = ({ issue }) => {
  return (
    <Card className="mb-4">
      <CardHeader className='place-content-stretch'>
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
        <div className="text-sm text-gray-500">{issue.timestamp}</div>
        <div className="flex space-x-2 pt-2">
          <Badge variant="outline" className=''>{issue.category}</Badge>
          <Badge variant="outline" className=''>{issue.sentiment}</Badge>
        </div>     
      </CardHeader>
      
      <CardContent>
        

        <p>{issue.content}</p>
      </CardContent>
      <CardFooter className="flex space-x-2 items-center">
        <div className="flex items-center">
          <MessageCircle className="mr-1" />
          {issue.numberofcomments}
        </div>
        
      </CardFooter>
    </Card>
  );
};

export default Issue;
