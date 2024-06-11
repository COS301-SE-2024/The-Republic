"use client";
import React from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import Feed from "@/components/Feed/Feed"; 

function ProfilePage() {
  
  const userId = "user123";

  return (
    <div>
      <ProfileHeader />
      <ProfileStats />
      <Feed userId={userId} showInputBox={false}/> 
    </div>
  );
}

export default ProfilePage;
