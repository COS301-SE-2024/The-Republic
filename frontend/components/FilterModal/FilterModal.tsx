import React from "react";
import Dropdown  from "@/components/Dropdown/Dropdown";
import { Location } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/contexts/UserContext";
import { dotVisualization } from "@/lib/api/dotVisualization";
import { Button } from "@/components/ui/button";

interface FilterModalProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  location: Location | null;
  setLocation: (location: Location | null) => void;
  onClose: () => void;
}

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

const FilterModal: React.FC<FilterModalProps> = ({
  sortBy,
  setSortBy,
  filter,
  setFilter,
  location,
  setLocation,
  onClose,
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

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="space-y-4">
        <Dropdown
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort by..."
        />
        <Dropdown
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          placeholder="Filter by..."
        />
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
      <Button className="mt-4 w-full" onClick={onClose}>Apply Filters</Button>
    </div>
  );
};

export default FilterModal;