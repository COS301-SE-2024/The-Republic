"use client";

import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  ProfileIcon,
  LogoutIcon,
  ReportsIcon,
  OrganizationIcon,
  NotificationsIcon,
  SettingsIcon,
  TrophyIcon,
} from "@/components/icons";

import { supabase } from "@/lib/globals";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import styles from "@/styles/Custom.module.css";
import { useUser } from "@/lib/contexts/UserContext";
import Link from "next/link";
import { signOutWithToast } from "@/lib/utils";
import { CircleHelp, XIcon } from "lucide-react";
import {
  ReactionNotification,
  CommentNotification,
  Issue,
} from "@/lib/types";
import UserAvatarWithScore from '@/components/UserAvatarWithScore/UserAvatarWithScore';
import { fetchUserData } from '@/lib/api/fetchUserData';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const navigateToIssue = (issueId: number) => {
    router.push(`/issues/${issueId}`);
  };

  useEffect(() => {
    if (!user) return;

    const channelA = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comment",
        },
        async (payload) => {
          const { new: notification } = payload;
          if (notification && Object.keys(notification).length > 0) {
            const { is_anonymous, user_id, issue_id, content } = notification as CommentNotification;

            const { data: issueData, error: issueError } = await supabase
              .from('issue')
              .select('user_id')
              .eq('issue_id', issue_id)
              .single();

            if (issueError) {
              console.error("Error fetching issue:", issueError);
              return;
            }

            if (issueData.user_id === user.user_id && user_id !== user.user_id) {
              let commenterInfo = null;
              if (!is_anonymous) {
                commenterInfo = await fetchUserData(user_id);
              }

              toast({
                title: "Notification",
                variant: "warning",
                description: (
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => navigateToIssue(Number(issue_id))}
                  >
                    {commenterInfo ? (
                      <UserAvatarWithScore
                        imageUrl={commenterInfo.image_url}
                        username={commenterInfo.username}
                        score={commenterInfo.user_score}
                        className="mr-2 w-8 h-8"
                      />
                    ) : (
                      <div className="w-8 h-8 mr-2 bg-gray-300 rounded-full"></div>
                    )}
                    <span>
                      {commenterInfo ? commenterInfo.username : "Someone"} commented on your issue
                    </span>
                  </div>
                ),
              });
            } else if (user_id === user.user_id) {
              toast({
                title: "Notification",
                variant: "warning",
                description: `Gained 10 Points for leaving a Comment on an Issue`,
              });
            } else if (content.includes(user.username)) {
              toast({
                title: "Notification",
                variant: "warning",
                description: `You've been mentioned in a comment.`,
              });
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reaction",
        },
        async (payload) => {
          const { new: notification } = payload;
          if (notification && Object.keys(notification).length > 0) {
            const { emoji, user_id, issue_id } = notification as ReactionNotification;
            
            const { data: issueData, error: issueError } = await supabase
              .from('issue')
              .select('user_id')
              .eq('issue_id', issue_id)
              .single();

            if (issueError) {
              console.error("Error fetching issue:", issueError);
              return;
            }

            if (issueData.user_id === user.user_id && user_id !== user.user_id) {
              const reactorInfo = await fetchUserData(user_id);

              toast({
                title: "Notification",
                variant: "warning",
                description: (
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => navigateToIssue(issue_id)}
                  >
                    {reactorInfo ? (
                      <UserAvatarWithScore
                        imageUrl={reactorInfo.image_url}
                        username={reactorInfo.username}
                        score={reactorInfo.user_score}
                        className="mr-2 w-8 h-8"
                      />
                    ) : (
                      <div className="w-8 h-8 mr-2 bg-gray-300 rounded-full"></div>
                    )}
                    <span>
                      {reactorInfo ? reactorInfo.username : "Someone"} reacted with {emoji} to your issue
                    </span>
                  </div>
                ),
              });
            } else if (user_id === user.user_id) {
              toast({
                title: "Notification",
                variant: "warning",
                description: `Gained 5 Points on your ${emoji} Reaction`,
              });
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "issue",
        },
        (payload) => {
          const { new: notification } = payload;

          if (notification && Object.keys(notification).length > 0) {
            const { user_id, content } = notification as Partial<Issue>;
            if (user_id === user?.user_id) {
              toast({
                title: "Notification",
                variant: "warning",
                description: `Gained 20 Points for Reporting an Issue`,
              });
            } else if (content && content.includes(user.username)) {
              toast({
                title: "Notification",
                variant: "warning",
                description: `You've been mentioned in an issue.`,
              });
            }
          }
        },
      )
      .subscribe();

    return () => {
      if (channelA && channelA.unsubscribe) {
        channelA.unsubscribe();
      }
    };
  }, [user]);

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-30 lg:z-0 w-[300px] border-r h-full overflow-y-auto bg-background transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="lg:hidden absolute top-4 right-4">
          <button onClick={onClose} className="p-2" title="Close">
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
              <Link href="/organization">
                <OrganizationIcon />
                Organizations
              </Link>
            </li>
            <li onClick={onClose}>
              <Link href="/leaderboard">
                <TrophyIcon />
                Leaderboard
              </Link>
            </li>
            {user ? (
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
            ) : (
              <li onClick={onClose}>
                <Link href="/login">
                  <ProfileIcon />
                  Login
                </Link>
              </li>
            )}
            <h4>
              <span>About</span>
            </h4>
            <li onClick={onClose}>
              <Link href={`/about`}>
                <CircleHelp /> About
              </Link>
            </li>
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
                  <AvatarFallback>{user.fullname[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className={`w-[70%] overflow-hidden overflow-ellipsis ${styles.userDetail}`}>
                  <h3 className="inline">{user.fullname}</h3>
                  <br />
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
