import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <Avatar className="w-full h-full">
        <AvatarImage src={imageUrl} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <div className="absolute -top-1 -right-1 bg-green-100 text-black rounded-full w-8 h-7 flex items-center justify-center text-s font-bold border border-gray-300">
        {score}
      </div>
    </div>
  );
};

export default UserAvatarWithScore;