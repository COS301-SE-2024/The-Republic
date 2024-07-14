"use client";

import React from "react";
import { ProfileStatsProps } from "@/lib/types";

const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalIssues,
  resolvedIssues,
  selectedTab,
  setSelectedTab,
}) => {
  const handleTabClick = (tab: "issues" | "resolved") => {
    setSelectedTab(tab);
  };

  const displayResolvedIssues = resolvedIssues ?? 0;
  const displayTotalIssues = totalIssues ?? 0;

  return (
    <div className="flex space-x-4 px-4 py-1 border-b">
      <div className="py-3">
        <div
          className={`relative inline-block cursor-pointer ${
            selectedTab === "issues" ? "text-green-500" : ""
          }`}
          onClick={() => handleTabClick("issues")}
        >
          <span className="font-bold">{displayTotalIssues}</span>{" "}
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
          <span className="font-bold">{displayResolvedIssues}</span>{" "}
          <span className="text-gray-600">Resolved</span>
          {selectedTab === "resolved" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
          )}
        </div>
      </div>
      {/* ... */}
    </div>
  );
};

export default ProfileStats;
