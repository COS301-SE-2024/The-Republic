"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { Upload } from "lucide-react";

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
    type: "banner" | "avatar"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser((prev) => ({
          ...prev,
          [type === "banner" ? "banner_url" : "image_url"]: reader.result as string,
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
      <div className="space-y-4">
        <div>
          <label htmlFor="banner" className="block text-sm font-medium text-gray-700">
            Banner Image
          </label>
          <label
            htmlFor="banner"
            className="mt-1 flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-base leading-normal">Upload Image</span>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "banner")}
            />
          </label>
        </div>
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <label
            htmlFor="avatar"
            className="mt-1 flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white"
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
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            id="fullname"
            value={updatedUser.fullname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            id="username"
            value={updatedUser.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <Input id="bio" value={updatedUser.bio} onChange={handleInputChange} />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button
          type="button"
          className={cn("inline-flex justify-center rounded-md px-4 py-2 font-medium")}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className={cn("inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700")}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
