import { LocationType } from "@/lib/types";

export async function fetchUserLocation(locationId: number): Promise<LocationType | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations/${locationId}`);
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        const locationData = responseData.data;
        return {
          label: `${locationData.suburb ? locationData.suburb + ', ' : ''}${locationData.city ? locationData.city + ', ' : ''}${locationData.province}`,
          value: locationData
        };
      }
    }
    console.error("Failed to fetch user location:", response.statusText);
  } catch (error) {
    console.error("Error fetching user location:", error);
  }
  return null;
}