"use client";

import React from "react";
import Dropdown from "@/components/Dropdown/Dropdown";

const sortOptions = {
  group: "Sort",
  items: [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "mostComments", label: "Most Comments" },
  ],
};

const filterOptions = {
  group: "Filter",
  items: [
    { value: "All", label: "All" },
    { value: "Subscriptions", label: "Subscriptions"},
    { value: "Healthcare", label: "Healthcare Services" },
    { value: "Public Safety", label: "Public Safety" },
    { value: "Water", label: "Water" },
    { value: "Transportation", label: "Transportation" },
    { value: "Electricity", label: "Electricity" },
    { value: "Sanitation", label: "Sanitation" },
    { value: "Social Services", label: "Social Services" },
    { value: "Administrative", label: "Administrative Services" },
  ],
};

interface RightSidebarProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ sortBy, setSortBy, filter, setFilter }) => {
  return (
    <div className="w-[300px] border-l min-h-80vh p-4">
      <div className="mb-4">
        <Dropdown
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort by..."
        />
      </div>
      <div>
        <Dropdown
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          placeholder="Filter by..."
        />
      </div>
    </div>
  );
};

export default RightSidebar;
