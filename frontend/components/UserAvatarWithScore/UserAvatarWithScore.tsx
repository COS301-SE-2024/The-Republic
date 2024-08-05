import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarWithScoreProps {
  imageUrl: string;
  username: string;
  score: number;
  className?: string;
  isAnonymous?: boolean;
  scoreFontSize?: number;
}

const UserAvatarWithScore: React.FC<UserAvatarWithScoreProps> = ({
  imageUrl,
  username,
  score,
  className,
  isAnonymous = false,
  scoreFontSize = 12,
}) => {

  const getBackgroundColor = (score: number) => {
    if (score === 0) return 'rgba(255, 255, 255, 1)';

    const baseColor = score > 0 ? [0, 255, 0] : [255, 0, 0];
    const maxIntensity = 0.5;
    const intensity = Math.min(Math.abs(score) / 100, maxIntensity);

    const color = baseColor.map(channel =>
      Math.round(channel * (1 - intensity) + 255 * intensity)
    );

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  const backgroundColor = getBackgroundColor(score);
  const scoreLength = Math.abs(score).toString().length;

  // Adjust bubble size based on scoreFontSize and score length
  const bubbleSize = Math.min(50, Math.max(50, 50 + (scoreLength - 1) * 5));

  // Use scoreFontSize prop and adjust based on score length
  const fontSize = Math.max(scoreFontSize * 0.75, scoreFontSize - (scoreLength - 1) * 2);

  // Format score for display
  const displayScore = (score: number) => {
    if (Math.abs(score) >= 1000000) {
      return (score / 1000000).toFixed(1) + 'M';
    } else if (Math.abs(score) >= 1000) {
      return (score / 1000).toFixed(1) + 'K';
    }
    return score;
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className="w-full h-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${username}'s avatar`}
            fill
          />
        )}
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      {!isAnonymous && (
        <div
          className="absolute top-0 right-0 text-black rounded-full flex items-center justify-center font-bold border border-gray-300 shadow-sm overflow-hidden"
          style={{
            backgroundColor,
            width: `${bubbleSize}%`,
            height: `${bubbleSize}%`,
            fontSize: `${fontSize}px`,
            lineHeight: '1',
            transform: 'translate(25%, -25%)',
            padding: '2px'
          }}
        >
          {displayScore(score)}
        </div>
      )}

    </div>
  );
};

export default UserAvatarWithScore;
