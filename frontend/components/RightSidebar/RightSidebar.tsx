"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/contexts/UserContext";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Location } from "@/lib/types";
import { dotVisualization } from "@/lib/api/dotVisualization";
import Image from "next/image";

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
    { value: "All", label: "All Categories" },
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
  const { user } = useUser();
  const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations`;

  const {
    data: locations,
    isLoading,
    isError,
  } = useQuery<Location[]>({
    queryKey: ["right_location", user],
    queryFn: () => dotVisualization(url),
    enabled: url !== undefined,
  });

  const labelFromLocation = (loc: Location) => (
    `${loc.suburb ?? loc.suburb + ","} ${loc.city}, ${loc.province}`
  );

  const locationItems = locations?.map((loc) => ({
    value: loc.location_id.toString(),
    label: labelFromLocation(loc),
  })) || [];

  const locationOptions = {
    group: "Location",
    items: [{
        value: "All",
        label: "All Locations"
      },
      ...locationItems
    ]
  };

  if (location) {
    const locationLabel = labelFromLocation(location);

    const matchingLocation = locationOptions.items.find((loc) => loc.label === locationLabel);
    location.location_id = matchingLocation?.value ?? '';
  }

  return (
    <div className="w-[250px] border-l h-full overflow-y-auto">
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
         {!isError && (
           <Dropdown
             options={locationOptions}
             value={location ? location.location_id.toString() : "All"}
             onChange={(value) => {
               const selectedLocation = locations?.find(
                 (loc) => loc.location_id.toString() === value
               );
               setLocation(selectedLocation || null);
             }}
             disabled={isLoading}
             placeholder="Select location..."
           />
         )}
        </div>
      </div>
      <div className="h-[50vh] relative mt-4">
        <Image 
          src={`/display_1.png`} 
          alt="Display Ad"
          objectFit="contain" 
          fill
        />
        <div className="absolute top-2 right-2 px-1 border-gray-400 border rounded text-muted-foreground text-sm">
          Ad
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
