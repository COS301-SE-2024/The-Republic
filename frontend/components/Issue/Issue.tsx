import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import MoreMenu from "../MoreMenu/MoreMenu";
import { Issue as IssueType } from "@/lib/types";
import { timeSince } from "@/lib/utils";
import Reaction from "../Reaction/Reaction";

interface IssueProps {
  issue: IssueType;
}

const Issue: React.FC<IssueProps> = ({ issue }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const menuItems = ["Delete"];
  if (!issue.resolved_at) {
    menuItems.push("Resolve Issue");
  }

  const isOwner = true; // will have to get this from api

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issue.issue_id}`,
        {
          method: "DELETE",
        }
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
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/resolve/${issue.issue_id}`,
        {
          method: "PUT",
        }
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
    setIsSubscribed(true);
    setShowSubscribePopup(false);
    // Perform additional logic here, such as making an API call
    console.log("Subscribed to:", type);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="place-content-stretch">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="pr-2">
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
          <div className="flex items-center">
            <button
              onClick={() => setShowSubscribePopup(true)}
              className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 mr-2"
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
            <MoreMenu
              menuItems={menuItems}
              isOwner={isOwner}
              onDelete={handleDelete}
              onResolve={handleResolve}
              onSubscribe={() => setShowSubscribePopup(true)}
            />
          </div>
        </div>
        <div className="flex space-x-2 pt-2">
          <Badge variant="outline" className="">
            {issue.category.name}
          </Badge>
          <Badge variant="outline" className="">
            {issue.sentiment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>{issue.content}</p>
        {issue.resolved_at && (
          <div className="flex space-x-2 pt-2">
            <Badge className="">Resolved {timeSince(issue.resolved_at)}</Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex space-x-2 items-center">
        <div className="flex items-center">
          <MessageCircle className="mr-1" />
        </div>
        <Reaction
          issueId={issue.issue_id}
          initialReactions={issue.reactions}
        />
      </CardFooter>
      {showSubscribePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleSubscribe("Issue")}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 w-full"
              >
                Subscribe to Issue
              </button>
              <button
                onClick={() => handleSubscribe("Category")}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 w-full"
              >
                Subscribe to Category
              </button>
              <button
                onClick={() => handleSubscribe("Location")}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 w-full"
              >
                Subscribe to Location
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Issue;