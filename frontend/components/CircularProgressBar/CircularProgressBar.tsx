import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const MAX_CHAR_COUNT = 500;

interface CircularProgressProps {
  charCount: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ charCount }) => {
  const getCircleColor = (count: number) => {
    if (count > MAX_CHAR_COUNT) return "#e0245e";
    if (count >= MAX_CHAR_COUNT - 20) return "#ffad1f";
    return "#28a745";
  };

  const remainingCharacters = MAX_CHAR_COUNT - charCount;
  const showRemainingCharacters = remainingCharacters <= 20;

  return (
    <div style={{ width: 30, height: 30 }}>
      <CircularProgressbar
        value={charCount}
        text={showRemainingCharacters ? `${remainingCharacters}` : ""}
        styles={buildStyles({
          pathColor: getCircleColor(charCount),
          textColor: getCircleColor(charCount),
          trailColor: "#d6d6d6",
          strokeLinecap: "butt",
          textSize: "48px",
          pathTransitionDuration: 0.4,
        })}
        maxValue={MAX_CHAR_COUNT}
      />
    </div>
  );
};

export default CircularProgress;
