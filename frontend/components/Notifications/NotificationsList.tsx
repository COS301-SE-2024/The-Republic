"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, CheckCircle, Plus, Trophy } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { subscribe } from "@/lib/api/subscription";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/contexts/UserContext";
import ErrorDisplay from '@/components/ui/error_display';
import { useTheme } from "next-themes";

import type { NotificationType } from "@/lib/types";
import { formatLongDate } from "@/lib/utils";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-6 w-6 animate-spin text-green-400" />
  </div>
);

export type Notification = "reaction" | "comment" | "resolution" | "issue" | "points";

const getNotificationIcon = (type: Notification): JSX.Element => {
  switch (type) {
    case "reaction":
      return <ThumbsUp className="h-5 w-5" />;
    case "comment":
      return <MessageSquare className="h-5 w-5" />;
    case "resolution":
      return <CheckCircle className="h-5 w-5" />;
    case "issue":
      return <Plus className="h-5 w-5" />;
    case "points":
      return <Trophy className="h-5 w-5" />;
    }
};

const getNotificationLink = (type: string, id: string = "") => {
  const linkMap: { [key: string]: string } = {
    points: "/leaderboard",
    resolution: `/issues/${id}`,
    issue: `/issues/${id}`,
    reaction: `/issues/${id}`,
    comment: `/issues/${id}`,
  };

  return linkMap[type] || "/";
};

const NotificationsList: React.FC = () => {
  const { user } = useUser();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/notifications`;
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`notifications_page`, user, url],
    queryFn: () => subscribe(user, { user_id: ((user != null) ? user.user_id : "no-request")}, url),
    enabled: true,
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!data || isError) {
    return (
      <ErrorDisplay
        title="No Notifications"
        message="You currently have no notifications. Once you receive notifications, they will appear here"
        linkHref="/"
        linkText="View Issues"
      />
    );
  }

  const { theme } = useTheme();

  const addSuspendMessage = (notif: NotificationType) => 
    notif.content.includes("external resolution rejected")
      ? notif.content + " You will be suspended from resolving until " + formatLongDate(
        new Date(notif.created_at).getTime() + 3600 * 24 * 1000
      )
      : notif.content;

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-700">
          {(data as NotificationType[]).map((notification, index) => (

            <li
              key={index}
              className={`flex items-start space-x-3 p-4 transition duration-200 
                ${theme === "dark" 
                  ? "hover:bg-[#262626] hover:text-white" 
                  : "hover:bg-gray-300 hover:text-black"}
              `}
            >
              <Link
                href={getNotificationLink(notification.type, (notification.type != "points") ? notification.issue_id : "none")}
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type as Notification)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {
                      (notification.type === "points")
                      ? addSuspendMessage(notification) :
                      (notification.type === "resolution")
                      ? "New resolution logged: " + notification.content:
                      (notification.type === "issue")
                      ? "New issue reported: " + notification.content :
                      (notification.type === "reaction")
                      ? "Someone " + notification.content + " to an Issue you are involved in." :
                      (notification.type === "comment")
                      ? `New comment on an issue you're following: "${notification.content}"` :
                      `You were mentioned in an Issue, Check it out.`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
