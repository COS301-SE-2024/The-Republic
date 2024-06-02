import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import MoreMenu from "../MoreMenu/MoreMenu";
import { Issue as IssueType } from "@/lib/types";
import { timeSince } from "@/lib/utils";
import { supabase } from "@/lib/globals";

interface IssueProps {
  issue: IssueType;
}

const Issue: React.FC<IssueProps> = ({ issue }) => {
  const menuItems = ["Delete"];
  if (!issue.resolved_at) {
    menuItems.push("Resolve Issue");
  }

  //TODO: GET THIS FROM THE API
  const isOwner = true; 

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/issues/${issue.issue_id}`, {
        method: "DELETE",
      });

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
      const response = await fetch(`http://localhost:8080/api/issues/resolve/${issue.issue_id}`, {
        method: "PUT",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to resolve issue");
      }
    } catch (error) {
      console.error("Error resolving issue:", error);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="place-content-stretch">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="pr-2">
              <Avatar>
                <AvatarImage src={issue.user.image_url || "https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg"} />
                <AvatarFallback>{issue.user.fullname[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center">
                <div className="font-bold">{issue.user.fullname}</div>
                <div className="mx-1 text-sm text-gray-500">·</div>
                <div className="text-sm text-gray-500">{timeSince(issue.created_at)}</div>
              </div>
              <div className="text-sm text-gray-600">{issue.user.username}</div>
            </div>
          </div>
          <MoreMenu
            menuItems={menuItems}
            isOwner={isOwner}
            onDelete={handleDelete}
            onResolve={handleResolve} // Pass handleResolve to MoreMenu
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <Badge variant="outline" className="">
            {issue.category.name}
          </Badge>
          <Badge variant="outline" className="">
            {issue.sentiment}
          </Badge>
          {issue.resolved_at && (
            <Badge className="bg-green-500">
              Resolved {timeSince(issue.resolved_at)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{issue.content}</p>
      </CardContent>
      <CardFooter className="flex space-x-2 items-center">
        <div className="flex items-center">
          <MessageCircle className="mr-1" />
          {issue.numberofcomments}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Issue;
