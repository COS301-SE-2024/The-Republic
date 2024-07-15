"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkImageFileAndToast, cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { Upload, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/globals";
import { useToast } from "../ui/use-toast";

interface EditProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  user,
  onUpdate,
  onCancel,
}) => {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

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

  const handleSave = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session && session.user) {
        const formData = new FormData();
        formData.append("fullname", updatedUser.fullname);
        formData.append("username", updatedUser.username);
        formData.append("bio", updatedUser.bio);
        if (file) {
          if (!(await checkImageFileAndToast(file, toast))) {
            return;
          }

          formData.append("profile_picture", file);
        }

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.user_id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        });

        const responseData = await response.json();

        if (response.ok) {
          onUpdate(responseData.data);
        } else {
          console.error("Failed to update profile:", responseData.error);
        }
      } else {
        console.error("User ID not found in session");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const removeImage = () => {
    setFile(null);
    setUpdatedUser((prev) => ({
      ...prev,
      image_url: user.image_url, // Revert to original image URL
    }));
  };

  return (
    <form>
      <div
        className={cn(
          "space-y-4",
          theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800",
        )}
      >
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
            onChange={handleInputChange}
            className={cn(
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300",
            )}
          />
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
      </div>
      <div className="mt-6 flex justify-end space-x-2">
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
      </div>
    </form>
  );
};

export default EditProfile;
