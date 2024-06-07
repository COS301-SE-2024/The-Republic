import React from "react";

const ProfileStats: React.FC = () => {
  return (
    <div className="flex space-x-4 px-4 py-1 border-b">
      <div className="relative inline-block">
        <span className="font-bold">42</span>{" "}
        <span className="text-gray-600">Issues</span>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
      </div>
    </div>
  );
};

export default ProfileStats;