"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import { useParams } from "next/navigation";
import ProfileFeed from "@/components/ProfileFeed/ProfileFeed";
import { Loader2 } from "lucide-react";

import { fetchUserData } from "@/lib/api/fetchUserData";

const ProfilePage: React.FC = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useParams() satisfies { userId: string };
  const [selectedTab, setSelectedTab] = useState<"issues" | "resolved">(
    "issues",
  );

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user_profile", userId],
    queryFn: () => fetchUserData(userId),
    enabled: userId !== undefined && userId !== null,
  });

  useEffect(() => {
    if (user) {
      setIsOwner(user.is_owner || false);
    }
  }, [user]);

  const handleUpdate = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="h-6 w-6 animate-spin text-green-400" />
    </div>
  );

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : isError ? (
        <p>Error loading This Issue.</p>
      ) : (
        <>
          {user ? (
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
          ) : (
            <div>User Details Not Found</div>
          )}
        </>
      )}
    </>
  );
};

export default ProfilePage;
