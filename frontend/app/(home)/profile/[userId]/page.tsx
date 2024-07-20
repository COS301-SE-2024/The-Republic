"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import LoadingIndicator from "@/components/ui/loader";
import { useParams } from "next/navigation";
import ProfileFeed from "@/components/ProfileFeed/ProfileFeed";

import { fetchUserData } from "@/lib/api/fetchUserData";

const ProfilePage: React.FC = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const userId = params.userId as string;
  const [selectedTab, setSelectedTab] = useState<"issues" | "resolved">(
    "issues",
  );

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user_profile', userId],
    queryFn: () => fetchUserData(),
    enabled: (userId !== undefined && userId !== null),
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
            <div>
              User Details Not Found
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfilePage;
