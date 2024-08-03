"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import GoogleMapReact from 'google-map-react';
import { LocationType } from "@/lib/types";
  
interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const MapModal: React.FC<MapModalProps> = ({
    isOpen,
    onClose,
    defaultLocation
  }) => {
    const hasLocation = defaultLocation && defaultLocation.value && defaultLocation.value.lat && defaultLocation.value.lng;
    const mapCenter = hasLocation
      ? { lat: defaultLocation.value.lat, lng: defaultLocation.value.lng }
      : { lat: -30.5595, lng: 22.9375 };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Location</DialogTitle>
            <DialogDescription>
              {hasLocation ? 'Here is the location on the map.' : 'No location available for this issue.'}
            </DialogDescription>
          </DialogHeader>
          <div style={{ height: '400px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
              center={mapCenter}
              defaultZoom={15} 
              options={{ gestureHandling: 'none' }}
            >
              {hasLocation && (
                <Marker
                  lat={defaultLocation.value.lat}
                  lng={defaultLocation.value.lng}
                />
              )}
            </GoogleMapReact>
          </div>
        </DialogContent>
      </Dialog>
    );
};

export default MapModal;