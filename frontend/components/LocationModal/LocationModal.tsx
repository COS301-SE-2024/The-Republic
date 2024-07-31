"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import GoogleMapReact from 'google-map-react';
import LocationAutocomplete from '../LocationAutocomplete/LocationAutocomplete';
import { LocationType } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSet: (location: LocationType) => void;
  defaultLocation?: LocationType | null;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface MarkerProps {
  lat: number;
  lng: number;
}

const Marker: React.FC<MarkerProps> = () => (
  <div style={{
    color: 'red',
    background: 'white',
    padding: '5px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    📍
  </div>
);

const LocationModal: React.FC<LocationModalProps> = ({
    isOpen,
    onClose,
    onLocationSet,
    defaultLocation
  }) => {
    const [activeTab, setActiveTab] = useState("map");
    const [mapCenter, setMapCenter] = useState(
      defaultLocation 
        ? { lat: defaultLocation.value.lat, lng: defaultLocation.value.lng }
        : { lat: -30.5595, lng: 22.9375 }
    );
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(defaultLocation || null);
    const [isGeolocationRequested, setIsGeolocationRequested] = useState(false);
  
    useEffect(() => {
      if (isOpen && !isGeolocationRequested && !defaultLocation) {
        setIsGeolocationRequested(true);
        toast({
          title: "Location Access",
          description: "We use your location to provide localized content and improve your experience.",
          duration: 5000,
        });
  
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newCenter = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setMapCenter(newCenter);
            },
            (error) => {
              console.error("Error getting geolocation:", error);
              toast({
                title: "Geolocation Error",
                description: "Unable to get your location. You can manually set your location on the map.",
                variant: "destructive",
              });
            }
          );
        }
      }
    }, [isOpen, isGeolocationRequested, defaultLocation]);

  const handleMapClick = async ({ lat, lng }: { lat: number, lng: number }) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      const detailedLocation = {
        province: "",
        city: "",
        suburb: "",
        district: "",
      };

      addressComponents.forEach((component: google.maps.GeocoderAddressComponent) => {
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

      const label = `${detailedLocation.suburb ? detailedLocation.suburb + ', ' : ''}${detailedLocation.city ? detailedLocation.city + ', ' : ''}${detailedLocation.province}`;

      setSelectedLocation({
        label,
        value: {
          place_id: data.results[0].place_id,
          ...detailedLocation,
          lat,
          lng,
        },
      });
    }
  };

  const handleSetLocation = () => {
    if (selectedLocation) {
      onLocationSet(selectedLocation);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
          <DialogDescription>
            Choose your location to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>
          <TabsContent value="map">
            <div style={{ height: '400px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                center={mapCenter}
                defaultZoom={11}
                onClick={handleMapClick}
              >
                {selectedLocation && selectedLocation.value.lat && selectedLocation.value.lng && (
                  <Marker
                    lat={selectedLocation.value.lat}
                    lng={selectedLocation.value.lng}
                  />
                )}
              </GoogleMapReact>
            </div>
          </TabsContent>
          <TabsContent value="search">
            <LocationAutocomplete
              location={selectedLocation}
              setLocation={setSelectedLocation}
            />
          </TabsContent>
        </Tabs>
        {selectedLocation && (
          <p className="mt-2">Selected location: {selectedLocation.label}</p>
        )}
        <Button onClick={handleSetLocation} disabled={!selectedLocation} className="mt-4">
          Use This Location
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;