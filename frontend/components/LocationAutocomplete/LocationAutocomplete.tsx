"use client";

import React from "react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocationType } from "@/lib/types";
import { SingleValue } from "react-select";

interface LocationAutocompleteProps {
  location: LocationType | null;
  setLocation: (location: LocationType | null) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface GooglePlacesAutocompleteResult {
  label: string;
  value: {
    place_id: string;
  };
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  location,
  setLocation,
}) => {
  const [locationInputVisible, setLocationInputVisible] = React.useState(false);

  const handlePlaceSelect = async (
    loc: SingleValue<GooglePlacesAutocompleteResult>,
  ) => {
    if (!loc) {
      setLocation(null);
      return;
    }

    const placeId = loc.value.place_id;
    const details = await geocodeByPlaceId(placeId);

    if (details.length > 0) {
      const place = details[0];
      const addressComponents = place.address_components;
      const detailedLocation = {
        province: "",
        city: "",
        suburb: "",
        district: "",
      };

      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_1")) {
          detailedLocation.province = component.long_name;
        } else if (component.types.includes("locality")) {
          detailedLocation.city = component.long_name;
        } else if (
          component.types.includes("sublocality") ||
          component.types.includes("neighborhood")
        ) {
          detailedLocation.suburb = component.long_name;
        } else if (component.types.includes("administrative_area_level_2")) {
          detailedLocation.district = component.long_name;
        }
      });

      setLocationInputVisible(false);
      setLocation({
        label: loc.label,
        value: {
          place_id: placeId,
          ...detailedLocation,
        },
      });
    }
  };

  return (
    <div>
      {location ? (
        <div className="flex items-center mx-2 p-1 rounded">
          <span className="mr-2">{location.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(null)}
            className="text-red-500"
          >
            X
          </Button>
        </div>
      ) : (
        <Popover
          open={locationInputVisible}
          onOpenChange={setLocationInputVisible}
        >
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="mx-2">
              <MapPin />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2">
            <GooglePlacesAutocomplete
              apiKey={GOOGLE_MAPS_API_KEY}
              selectProps={{
                value: location,
                onChange: handlePlaceSelect,
                placeholder: "Enter location",
                styles: {
                  input: (provided) => ({
                    ...provided,
                    color: "var(--foreground)",
                    backgroundColor: "var(--background)",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "var(--foreground)",
                  }),
                },
              }}
              autocompletionRequest={{
                componentRestrictions: { country: "za" },
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationAutocomplete;
