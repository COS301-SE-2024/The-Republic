"use client";

import React, { useState } from "react";
import CreatePost from "@/components/CreatePost/CreatePost";

interface ProfileStatsProps {
  userId: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState("issues");

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex space-x-4 px-4 py-1 border-b">
      <div className="py-3">
        <div
          className={`relative inline-block cursor-pointer ${
            selectedTab === "issues" ? "text-green-500" : ""
          }`}
          onClick={() => handleTabClick("issues")}
        >
          <span className="font-bold">42</span>{" "}
          <span className="text-gray-600">Issues</span>
          {selectedTab === "issues" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
          )}
        </div>
      </div>
      <div className="py-3">
        <div
          className={`relative inline-block cursor-pointer ${
            selectedTab === "resolved" ? "text-green-500" : ""
          }`}
          onClick={() => handleTabClick("resolved")}
        >
          <span className="font-bold">28</span>{" "}
          <span className="text-gray-600">Resolved</span>
          {selectedTab === "resolved" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
          )}
        </div>
      </div>
      <div className="flex items-center ml-auto py-3">
        <CreatePost />
      </div>
    </div>
  );
};

export default ProfileStats;
