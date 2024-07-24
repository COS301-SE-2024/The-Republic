"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Location } from "@/lib/types";


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
    { value: "Healthcare Services", label: "Healthcare Services" },
    { value: "Public Safety", label: "Public Safety" },
    { value: "Water", label: "Water" },
    { value: "Transportation", label: "Transportation" },
    { value: "Electricity", label: "Electricity" },
    { value: "Sanitation", label: "Sanitation" },
    { value: "Social Services", label: "Social Services" },
    { value: "Administrative Services", label: "Administrative Services" },
  ],
};


interface RightSidebarProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  location: Location | null;
  setLocation: (location: Location | null) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  sortBy,
  setSortBy,
  filter,
  setFilter,
  location,
  setLocation,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations`);
        const data = await response.json();
        if (data.success) {
          setLocations(data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const locationOptions = {
    group: "Location",
    items: locations.map(loc => ({
      value: loc.location_id.toString(),
      label: loc.suburb ? `${loc.suburb}, ${loc.city}, ${loc.province}` : `${loc.city}, ${loc.province}`,
    })),
  };

  return (
    <div className="w-[300px] border-l h-full overflow-y-auto">
      <div className="sticky top-0 p-4">
        <div className="mb-4">
          <Dropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by..."
          />
        </div>
        <div className="mb-4">
          <Dropdown
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            placeholder="Filter by..."
          />
        </div>
        <div className="mb-4">
          <Dropdown
            options={locationOptions}
            value={location ? location.location_id.toString() : ""}
            onChange={(value) => {
              const selectedLocation = locations.find(loc => loc.location_id.toString() === value);
              setLocation(selectedLocation || null);
            }}
            placeholder="Select location..."
          />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
