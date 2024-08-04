"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import { useParams } from "next/navigation";
import ProfileFeed from "@/components/ProfileFeed/ProfileFeed";
import { Loader2 } from "lucide-react";
import { fetchUserData } from "@/lib/api/fetchUserData";
import { fetchUserResolutions } from "@/lib/api/fetchUserResolutions";
import { profileFetchIssues } from "@/lib/api/profileFetchIssues";

const ProfilePage: React.FC = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useParams() satisfies { userId: string };
  const [selectedTab, setSelectedTab] = useState<"issues" | "resolved" | "resolutions">("issues");

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user_profile", userId],
    queryFn: () => fetchUserData(userId),
    enabled: userId !== undefined && userId !== null,
  });

  const {
    data: issues,
    isLoading: isIssuesLoading,
    isError: isIssuesError,
  } = useQuery({
    queryKey: ["profile_issues", userId],
    queryFn: () => {
      if (user) {
        return profileFetchIssues(user, userId, `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/user`);
      }
      return null;
    },
    enabled: !!user,
  });

  const {
    data: resolutions,
    isLoading: isResolutionsLoading,
    isError: isResolutionsError,
  } = useQuery({
    queryKey: ["user_resolutions", userId],
    queryFn: () => fetchUserResolutions(user!, userId),
    enabled: !!user,
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

  const isLoading = isUserLoading || isIssuesLoading || isResolutionsLoading;
  const isError = isUserError || isIssuesError || isResolutionsError;

  const totalIssues = issues?.length || 0;
  const resolvedIssues = issues?.filter(issue => issue.resolved_at).length || 0;
  const totalResolutions = resolutions?.length || 0;

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
                totalIssues={totalIssues}
                resolvedIssues={resolvedIssues}
                totalResolutions={totalResolutions}
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