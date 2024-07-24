import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bell } from "lucide-react";
import MoreMenu from "../MoreMenu/MoreMenu";
import { IssueProps } from "@/lib/types";
import { timeSince } from "@/lib/utils";
import Reaction from "../Reaction/Reaction";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { toast } from "../ui/use-toast";
import Image from "next/image";

const Issue: React.FC<IssueProps> = ({ issue }) => {
  const { user } = useUser();
  const router = useRouter();
  const [showSubscribeDropdown, setShowSubscribeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = ["Delete"];
  if (!issue.resolved_at) {
    menuItems.push("Resolve Issue");
  }

  const isOwner = user && user.user_id === issue.user_id;

  const handleDelete = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please log in to delete issues.",
      });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({ issue_id: issue.issue_id }),
        },
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete issue");
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleResolve = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please log in to resolve issues.",
      });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/resolve/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({ issue_id: issue.issue_id }),
        },
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to resolve issue");
      }
    } catch (error) {
      console.error("Error resolving issue:", error);
    }
  };

  const handleSubscribe = (type: string) => {
    setShowSubscribeDropdown(false);
    console.log("Subscribed to:", type);
  };

  const handleCommentClick = () => {
    router.push(`/issues/${issue.issue_id}`);
  };

  const handleAvatarClick = () => {
    if (!issue.is_anonymous) {
      router.push(`/profile/${issue.user.user_id}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSubscribeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <Card className="mb-4">
      <CardHeader className="place-content-stretch">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div
              className="pr-2"
              onClick={handleAvatarClick}
              style={{ cursor: issue.is_anonymous ? "default" : "pointer" }}
            >
              <Avatar>
                <AvatarImage src={issue.user.image_url} />
                <AvatarFallback>{issue.user.fullname[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center">
                <div className="font-bold">{issue.user.fullname}</div>
                <div className="mx-1 text-sm text-gray-500">·</div>
                <div className="text-sm text-gray-500">
                  {timeSince(issue.created_at)}
                </div>
              </div>
              <div className="text-sm text-gray-600">{issue.user.username}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center items-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none"
                  id="subscribe-menu"
                  onClick={() =>
                    setShowSubscribeDropdown(!showSubscribeDropdown)
                  }
                  title="Subscribe"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {showSubscribeDropdown && (
                <div
                  ref={dropdownRef}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="subscribe-menu"
                >
                  <div className="py-1" role="none">
                    <button
                      onClick={() => handleSubscribe("Issue")}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                    >
                      Subscribe to Issue
                    </button>
                    <button
                      onClick={() => handleSubscribe("Category")}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                    >
                      Subscribe to Category
                    </button>
                    <button
                      onClick={() => handleSubscribe("Location")}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                    >
                      Subscribe to Location
                    </button>
                  </div>
                </div>
              )}
            </div>
            {isOwner && (
              <MoreMenu
                menuItems={menuItems}
                isOwner={isOwner}
                onDelete={handleDelete}
                onResolve={handleResolve}
                onSubscribe={handleSubscribe}
              />
            )}
          </div>
        </div>
        <div className="flex space-x-2 pt-2">
          <Badge variant="outline" className="">
            {issue.category.name}
          </Badge>
          <Badge variant="outline" className="">
            {issue.sentiment}
          </Badge>
          {issue.location && (
            <Badge variant="outline" className="">
              {issue.location.suburb
                ? `${issue.location.suburb}, ${issue.location.city}, ${issue.location.province}`
                : `${issue.location.city}, ${issue.location.province}`}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{issue.content}</p>
        {issue.image_url && (
          <div className="relative w-1/4 h-auto mt-4">
            <Image
              src={issue.image_url}
              alt="Issue"
              layout="responsive"
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>
        )}
        {issue.resolved_at && (
          <div className="flex space-x-2 pt-2">
            <Badge className="">Resolved {timeSince(issue.resolved_at)}</Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex space-x-2 items-center">
        <div className="flex items-center" onClick={handleCommentClick}>
          <MessageCircle className="mr-1 cursor-pointer" />
          <span>{issue.comment_count}</span>
        </div>
        <Reaction
          issueId={issue.issue_id}
          initialReactions={issue.reactions}
          userReaction={issue.user_reaction}
        />
      </CardFooter>
    </Card>
  );
};

export default Issue;
