"use client";

import React, { useEffect } from "react";
import {
  HomeIcon,
  ProfileIcon,
  LogoutIcon,
  ReportsIcon,
  NotificationsIcon,
  SettingsIcon,
} from "../icons";

import { supabase } from "@/lib/globals";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { HomeAvatarProps } from "@/lib/types";
import styles from "@/styles/Custom.module.css";
import { useUser } from "@/lib/contexts/UserContext";

import Link from "next/link";
import { signOutWithToast } from "@/lib/utils";

const Sidebar: React.FC<HomeAvatarProps> = () => {
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const channelA = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comment",
        },
        (payload) => {
          toast({
            variant: "warning",
            description: "Comments Flooding for a Reported Issue",
          });
          const { new: notification } = payload;
          console.log("Comments Notification Data: ", notification);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reaction",
        },
        (payload) => {
          toast({
            variant: "warning",
            description: "Issue Gaining Exposure, new Reactions",
          });
          const { new: notification } = payload;
          console.log("Reaction Notification Data Now: ", notification);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "issue",
        },
        (payload) => {
          toast({
            variant: "warning",
            description: "New Issue Reported, Check it Out!",
          });
          const { new: notification } = payload;
          console.log("Issue Notification Data: ", notification);
        },
      )
      .subscribe((status) => {
        console.log("Subscription Result: ", status);
      });

    return () => {
      channelA.unsubscribe();
    };
  }, []);

  return (
    <div className="w-[300px] border-r h-full overflow-y-auto">
      <div className={`${styles.sidebar} sticky top-0`}>
        <ul className={styles.sidebarLinks}>
          <h4>
            <span>General</span>
          </h4>
          <li>
            <Link href="/">
              <HomeIcon />
              Home
            </Link>
          </li>
          <li>
            <Link href="/analytics">
              <ReportsIcon />
              Analytics
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link href="/notifications">
                  <NotificationsIcon />
                  Notifications
                </Link>
              </li>
              <h4>
                <span>Account</span>
              </h4>
              <li>
                <Link href={`/profile/${user.user_id}`}>
                  <ProfileIcon />
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <SettingsIcon />
                  Settings
                </Link>
              </li>
              <li>
                <Link href="" onClick={() => signOutWithToast(toast)}>
                  <LogoutIcon />
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
        {user && (
          <div className={styles.userAccount}>
            <div className={styles.userProfile}>
              <Avatar>
                <AvatarImage src={user.image_url} />
                <AvatarFallback>{user.fullname[0]}</AvatarFallback>
              </Avatar>
              <div className={styles.userDetail}>
                <h3>{user.fullname}</h3>
                <span>@{user.username}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
