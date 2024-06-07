// src/components/ProfileStats/ProfileStats.tsx
import React from "react";
import { SquarePen } from "lucide-react";

const ProfileStats: React.FC = () => {
  return (
    <div className="flex space-x-4 px-4 py-1 border-b">
      <div className="relative inline-block">
        <span className="font-bold">42</span>{" "}
        <span className="text-gray-600">Issues</span>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
      </div>
      <div className="relative inline-block">
        <span className="font-bold">28</span>{" "}
        <span className="text-gray-600">Resolved</span>
      </div>
      <div className="flex items-center ml-auto">
        <SquarePen className="w-4 h-4 mr-1" />
        <span className="text-sm text-gray-600">Write a post</span>
      </div>
    </div>
  );
};

export default ProfileStats;