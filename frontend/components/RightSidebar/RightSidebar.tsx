"use client";

import React, { useState } from "react";
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
    { value: "all", label: "All" },
    { value: "healthcare", label: "Healthcare Services" },
    { value: "publicSafety", label: "Public Safety" },
    { value: "water", label: "Water" },
    { value: "transportation", label: "Transportation" },
    { value: "electricity", label: "Electricity" },
    { value: "sanitation", label: "Sanitation" },
    { value: "socialServices", label: "Social Services" },
    { value: "administrative", label: "Administrative Services" },
  ],
};

const RightSidebar = () => {
  const [sortBy, setSortBy] = useState("");
  const [filter, setFilter] = useState("");

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
