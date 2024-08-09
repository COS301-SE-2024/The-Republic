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

import type { NotificationType } from "@/lib/types";

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
      <div className="flex flex-col items-center justify-center min-h-[65vh] mt-10">
        <h4 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">No Notifications</h4>
        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">You currently have no notifications. Once you receive notifications, they will appear here.</p>
        <Link href="/" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
          View Issues
          <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-700">
          {(data as NotificationType[]).map((notification, index) => (

            <li
              key={index}
              className="flex items-start space-x-3 p-4 hover:bg-gray-50"
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
                      ? notification.content :
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
