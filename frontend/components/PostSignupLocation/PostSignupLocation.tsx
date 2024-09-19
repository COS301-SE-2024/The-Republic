import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import LocationModal from "@/components/LocationModal/LocationModal";
import { LocationType, User, ProfileUpdate } from "@/lib/types";
import { updateUserProfile } from "@/lib/api/updateProfile";
import { supabase } from "@/lib/globals";

interface PostSignupLocationProps {
  onComplete: () => void;
}

export default function PostSignupLocation({ onComplete }: PostSignupLocationProps) {
  const [showModal, setShowModal] = useState(true);
  const { toast } = useToast();

  const handleLocationSet = async (location: LocationType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const currentUser: User = {
        user_id: user.id,
        fullname: user.user_metadata?.fullname || "",
        username: user.user_metadata?.username || "",
        bio: "",
        image_url: "",
        email_address: "",
        total_issues: 0,
        resolved_issues: 0,
        user_score: 0,
        access_token: "",
        location_id: null,
      };

      const dataToUpdate: ProfileUpdate = {
        location: location,
        fullname: currentUser.fullname,
        username: currentUser.username, 
        bio: currentUser.bio,
      };

      const result = await updateUserProfile(currentUser, dataToUpdate, null);

      if (result.error) throw new Error(result.error);

      toast({
        title: "Location set successfully",
        description: "Welcome to The Republic!",
      });
      onComplete();
    } catch (error) {
      console.error("Error setting location:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set location. Please try again.",
      });
      setShowModal(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Welcome to The Republic</h2>
        <p className="mb-4">Let's set up your default location to personalize your experience.</p>
        <LocationModal
          isOpen={showModal}
          onClose={() => {}} // This won't be called due to required prop
          onLocationSet={handleLocationSet}
          required={true}
        />
      </div>
    </div>
  );
}