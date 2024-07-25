import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarWithScoreProps {
  imageUrl: string;
  username: string;
  score: number;
  className?: string;
  isAnonymous?: boolean;
}

const UserAvatarWithScore: React.FC<UserAvatarWithScoreProps> = ({ 
  imageUrl, 
  username, 
  score,
  className,
  isAnonymous = false
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
  const scoreLength = Math.abs(score).toString().length;
  const bubbleSize = Math.max(40, 30 + scoreLength * 5); // Increase size based on digit count

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className="w-full h-full">
        <AvatarImage src={imageUrl} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      {!isAnonymous && (
        <div 
          className="absolute -top-1 -right-1 text-black rounded-full flex items-center justify-center font-bold border border-gray-300 shadow-sm"
          style={{
            backgroundColor,
            width: `${bubbleSize}%`,
            height: `${bubbleSize}%`,
            minWidth: '20px',
            minHeight: '20px',
            fontSize: `calc(${8 + scoreLength}px + 0.1vw)`
          }}
        >
          {score}
        </div>
      )}
    </div>
  );
};

export default UserAvatarWithScore;