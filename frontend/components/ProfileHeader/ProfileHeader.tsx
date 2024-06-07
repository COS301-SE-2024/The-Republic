import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

const ProfileHeader: React.FC = () => {
  const user = {
    fullname: "Jane Doe",
    username: "@janedoe",
    bio: "Frontend developer | Coffee enthusiast | Adventure seeker",
    image_url: "https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg",
    banner_url: "https://via.placeholder.com/1500x500",
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
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
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
