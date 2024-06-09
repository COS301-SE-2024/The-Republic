"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Upload } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

const ProfileHeader: React.FC = () => {
  const [user, setUser] = useState({
    fullname: "Jane Doe",
    username: "@janedoe",
    bio: "Frontend developer | Coffee enthusiast | Adventure seeker",
    image_url: "https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg",
    banner_url: "https://via.placeholder.com/1500x500",
  });

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // API CALL
    console.log("Profile updated!", user);
    
    setTimeout(() => {
      closeButtonRef.current?.click();
    }, 500); 
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          [type === 'banner' ? 'banner_url' : 'image_url']: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${user.banner_url})` }}
      />
      <div className="px-4 pb-4">
        <div className="-mt-16 flex justify-between items-end">
          <Avatar className="w-32 h-32 border-4 border-white">
            <AvatarImage src={user.image_url} />
            <AvatarFallback>{user.fullname[0]}</AvatarFallback>
          </Avatar>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 fixed inset-0" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96">
                <Dialog.Title className="text-xl font-semibold mb-4">Edit Profile</Dialog.Title>
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="banner" className="block text-sm font-medium text-gray-700">Banner Image</label>
                      <label htmlFor="banner" className="mt-1 flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="text-base leading-normal">Upload Image</span>
                        <Input id="banner" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <label htmlFor="avatar" className="mt-1 flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="text-base leading-normal">Upload Image</span>
                        <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <Input id="fullname" value={user.fullname} onChange={(e) => setUser({ ...user, fullname: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <Input id="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <Input id="bio" value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <Dialog.Close asChild>
                      <Button type="button" variant="outline" ref={closeButtonRef}>Cancel</Button>
                    </Dialog.Close>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
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