"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import { User } from "@/lib/types";
import { supabase } from "@/lib/globals";
import { useParams } from "next/navigation";
import ProfileFeed from "@/components/ProfileFeed/ProfileFeed";
import { FaSpinner } from 'react-icons/fa';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const userId = params.userId as string;
  const [selectedTab, setSelectedTab] = useState<"issues" | "resolved">("issues");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;

        if (session && session.user) {
          const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`;
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            },
          });
          const responseData = await response.json();
          if (responseData.success) {
            setUser(responseData.data);
            setIsOwner(responseData.data.is_owner);
          } else {
            console.error("Failed to fetch user data:", responseData.error);
          }
        } else {
          console.error("User ID not found in session");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-24">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader 
        user={user} 
        isOwner={isOwner} 
        handleUpdate={handleUpdate} 
        handleCancel={handleCancel} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
      />
      <ProfileStats 
        userId={user.user_id} 
        totalIssues={user.total_issues} 
        resolvedIssues={user.resolved_issues} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
      />
      <div className="mt-5"></div>
      <ProfileFeed userId={user.user_id} selectedTab={selectedTab} />
    </div>
  );
};

export default ProfilePage;
