import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { cn } from "@/lib/utils";

interface UserAvatarWithScoreProps {
  imageUrl: string;
  username: string;
  score: number;
  className?: string;
}

const UserAvatarWithScore: React.FC<UserAvatarWithScoreProps> = ({ 
  imageUrl, 
  username, 
  score,
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      <Avatar>
        <AvatarImage src={imageUrl} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {score}
      </div>
    </div>
  );
};

export default UserAvatarWithScore;