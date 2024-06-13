"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { Upload } from "lucide-react";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedUser((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "avatar"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser((prev) => ({
          ...prev,
          [type === "avatar" ? "image_url" : "image_url"]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate(updatedUser);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form>
      <div className={cn("space-y-4", theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800")}>
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium">
            Profile Picture
          </label>
          <label
            htmlFor="avatar"
            className={cn(
              "mt-1 flex items-center px-4 py-2 rounded-lg shadow-lg tracking-wide uppercase border cursor-pointer",
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white"
                : "bg-white text-blue-700 border-blue-500 hover:bg-blue-500 hover:text-white"
            )}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-base leading-normal">Upload Image</span>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "avatar")}
            />
          </label>
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
                : "bg-white text-gray-800 border-gray-300"
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
                : "bg-white text-gray-800 border-gray-300"
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
                : "bg-white text-gray-800 border-gray-300"
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
              : "bg-white text-gray-800 hover:bg-gray-200"
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
              : "bg-green-600 text-white hover:bg-green-700"
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