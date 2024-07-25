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
  
  const getBackgroundColor = (score: number) => {
    if (score === 0) return 'rgba(255, 255, 255, 1)'; 

    const baseColor = score > 0 ? [0, 255, 0] : [255, 0, 0]; // Green or Red
    const maxIntensity = 0.5; 
    const intensity = Math.min(Math.abs(score) / 100, maxIntensity); 

    const color = baseColor.map(channel => 
      Math.round(channel * (1 - intensity) + 255 * intensity)
    );

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  const backgroundColor = getBackgroundColor(score);

  return (
    <div className={cn("relative", className)}>
      <Avatar className="w-full h-full">
        <AvatarImage src={imageUrl} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <div 
        className="absolute -top-1 -right-1 text-black rounded-full w-8 h-7 flex items-center justify-center text-s font-bold border border-gray-300"
        style={{ backgroundColor }}
      >
        {score}
      </div>
    </div>
  );
};

export default UserAvatarWithScore;
