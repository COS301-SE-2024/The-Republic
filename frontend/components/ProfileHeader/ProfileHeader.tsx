"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import EditProfile from "@/components/EditProfile/EditProfile";
import { useTheme } from "next-themes";

interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
  handleUpdate: (updatedUser: User) => void;
  handleCancel: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwner,
  handleUpdate,
  handleCancel,
  isEditing,
  setIsEditing,
}) => {
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      <div className="h-32 bg-cover bg-center" />
      <div className="px-4 pb-4">
        <div className="-mt-16 flex justify-between items-end">
          <Avatar className="w-32 h-32 border-4 border-white">
            <AvatarImage src={user.image_url} />
            <AvatarFallback>{user.fullname[0]}</AvatarFallback>
          </Avatar>
          {isOwner && (
            <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
              <Dialog.Trigger asChild>
                <Button className="inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-white">
                  <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0" />
                <Dialog.Content
                  className={cn(
                    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg w-96",
                    theme === "dark"
                      ? "bg-black text-white"
                      : "bg-white text-gray-800",
                  )}
                >
                  <Dialog.Title className="text-xl font-semibold mb-4">
                    Edit Profile
                  </Dialog.Title>
                  <EditProfile
                    user={user}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{user.fullname}</h1>
          <p className="text-gray-600">{user.username}</p>
          <p className="mt-2">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
