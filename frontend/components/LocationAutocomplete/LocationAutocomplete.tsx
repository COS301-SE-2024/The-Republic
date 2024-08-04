"use client";

import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
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
  location = null,
  setLocation,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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
  
      const lat = place.geometry?.location.lat();
      const lng = place.geometry?.location.lng();
  
      setLocation({
        label: loc.label,
        value: {
          place_id: placeId,
          ...detailedLocation,
          lat,
          lng,
        },
      });
    }
  };
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <GooglePlacesAutocomplete
        apiKey={GOOGLE_MAPS_API_KEY}
        selectProps={{
          value: location,
          onChange: handlePlaceSelect,
          placeholder: "Search for a location",
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
            }),
            input: (provided) => ({
              ...provided,
              color: "var(--foreground)",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "var(--accent)" : "var(--background)",
              color: "var(--foreground)",
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
    </div>
  );
};

export default LocationAutocomplete;