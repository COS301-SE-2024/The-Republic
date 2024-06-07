import React from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import UserIssues from "@/components/UserIssues/UserIssues";

function page() {
  return (
  <div>
    <ProfileHeader />
    <ProfileStats />
    <UserIssues />
  </div>
  );
}

export default page;
