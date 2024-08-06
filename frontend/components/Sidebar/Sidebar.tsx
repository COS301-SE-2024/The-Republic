"use client";

import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  ProfileIcon,
  LogoutIcon,
  ReportsIcon,
  TrophyIcon,
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
import { XIcon } from "lucide-react";

interface SidebarProps extends HomeAvatarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, ...props }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [showLogout, setShowLogout] = useState(false);

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

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={onClose}
        />
      )}
    <div className={`fixed inset-y-0 left-0 z-30 w-[300px] border-r h-full overflow-y-auto bg-background transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      <div className="lg:hidden absolute top-4 right-4">
          <button onClick={onClose} className="p-2">
            <XIcon className="h-6 w-6" />
          </button>
      </div>
      <div className={`${styles.sidebar} sticky top-0`}>
        <ul className={styles.sidebarLinks}>
          <h4>
            <span>General</span>
          </h4>
          <li onClick={onClose}>
            <Link href="/">
              <HomeIcon />
              Home
            </Link>
          </li>
          <li onClick={onClose}>
            <Link href="/analytics">
              <ReportsIcon />
              Analytics
            </Link>
          </li>
          <li onClick={onClose}>
            <Link href="/leaderboard">
              <TrophyIcon />
              Leaderboard
            </Link>
          </li>
          {user && (
            <>
              <li onClick={onClose}>
                <Link href="/notifications">
                  <NotificationsIcon />
                  Notifications
                </Link>
              </li>
              <h4>
                <span>Account</span>
              </h4>
              <li onClick={onClose}>
                <Link href={`/profile/${user.user_id}`}>
                  <ProfileIcon />
                  Profile
                </Link>
              </li>
              <li onClick={onClose}>
                <Link href="/settings">
                  <SettingsIcon />
                  Settings
                </Link>
              </li>
            </>
          )}
        </ul>
        {user && (
          <div className={styles.userAccount}>
            {showLogout && (
              <div className={styles.logoutOverlay}>
                <ul className={styles.sidebarLinks}>
                  <li>
                    <Link href="" onClick={() => signOutWithToast(toast)}>
                      <LogoutIcon />
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            <div className={styles.userProfile} onClick={toggleLogout}>
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
    </>
  );
};

export default Sidebar;
