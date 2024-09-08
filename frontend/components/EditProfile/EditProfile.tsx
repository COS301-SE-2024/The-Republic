"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkImageFileAndToast, cn } from "@/lib/utils";
import { EditProfileProps, LocationType, ProfileUpdate } from "@/lib/types";
import { Upload, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "../ui/use-toast";
import LocationModal from "@/components/LocationModal/LocationModal";
import { fetchUserLocation } from "@/lib/api/fetchUserLocation";
import { updateUserProfile } from "@/lib/api/updateProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const EditProfile: React.FC<EditProfileProps> = ({
  user,
  onUpdate,
  onCancel,
}) => {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);

  useEffect(() => {
    const loadUserLocation = async () => {
      if (user.location_id) {
        const location = await fetchUserLocation(user.location_id);
        if (location) {
          setUserLocation(location);
        }
      }
    };

    loadUserLocation();
  }, [user.location_id]);

  const handleLocationSet = (location: LocationType) => {
    setUserLocation(location);
    setUpdatedUser((prev) => ({
      ...prev,
      location: location,
    }));
    setIsLocationModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUpdatedUser((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser((prev) => ({
          ...prev,
          image_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: async (dataToUpdate: ProfileUpdate) => {
      if (user) {
        return await updateUserProfile(user, dataToUpdate, file);
      } else {
        toast({
          description: "You need to be logged in to update your profile",
        });
      }
    },
    onSuccess: (data) => {
      onUpdate(data.data);
      toast({
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast({
        description: error.message,
      });
    },
  });

  const handleSave = async () => {
    if (user && updatedUser) {
      if (file) {
        if (!(await checkImageFileAndToast(file, toast))) {
          return;
        }
      }

      const dataToUpdate: ProfileUpdate = {
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        bio: updatedUser.bio,
      };

      if (userLocation) {
        dataToUpdate.location = userLocation;
      }

      mutation.mutate(dataToUpdate);
    }
  };
  const handleCancel = () => {
    onCancel();
  };

  const removeImage = () => {
    setFile(null);
    setUpdatedUser((prev) => ({
      ...prev,
      image_url: user.image_url,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium">
              Profile Picture
            </label>
            <div className="flex items-center">
              <label
                htmlFor="avatar"
                className={cn(
                  "mt-1 flex items-center px-4 py-2 rounded-lg shadow-lg tracking-wide uppercase border cursor-pointer",
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white"
                    : "bg-white text-blue-700 border-blue-500 hover:bg-blue-500 hover:text-white",
                )}
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-base leading-normal">Upload Image</span>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {file && (
                <Button
                  type="button"
                  className="ml-4 inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700"
                  onClick={removeImage}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullname"
              value={updatedUser.fullname}
              onChange={handleInputChange}
              className={cn(
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300",
              )}
            />
          </div>
          <div>
  <label htmlFor="username" className="block text-sm font-medium">
    Username
  </label>
  <Input
    id="username"
    value={updatedUser.username}
    readOnly
    className={cn(
      theme === "dark"
        ? "bg-gray-700 text-white border-gray-600"
        : "bg-white text-gray-800 border-gray-300",
    )}
  />
  <p className="text-sm text-gray-500 mt-2">
    To change your username, please visit <a href="/settings" className="text-blue-500">Settings</a>.
  </p>
</div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium">
              Bio
            </label>
            <Input
              id="bio"
              value={updatedUser.bio}
              onChange={handleInputChange}
              className={cn(
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300",
              )}
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <Button type="button" onClick={() => setIsLocationModalOpen(true)} className="mt-1">
              {userLocation ? 'Update Location' : 'Set Location'}
            </Button>
            {userLocation && (
              <p className="mt-1 text-sm">{userLocation.label}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              className={cn(
                "inline-flex justify-center rounded-md px-4 py-2 font-medium",
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-800 hover:bg-gray-200",
              )}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className={cn(
                "inline-flex justify-center rounded-md px-4 py-2 font-medium",
                theme === "dark"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-600 text-white hover:bg-green-700",
              )}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onLocationSet={handleLocationSet}
          defaultLocation={userLocation}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
