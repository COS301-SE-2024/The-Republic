import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, MoreVertical } from 'lucide-react';
import { useUser } from "@/lib/contexts/UserContext";
import { timeSince } from "@/lib/utils";
import Reaction from "../Reaction/Reaction";
import Image from "next/image";
import MoreMenu from "../MoreMenu/MoreMenu";
import CommentList from "../Comment/CommentList";

interface OrgPostProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    image_url?: string;
    organization: {
      id: string;
      name: string;
      profile_photo?: string;
    };
    reactions: any; // Replace with proper type
    comment_count: number;
  };
  onDeletePost?: (post: OrgPostProps['post']) => void;
  isAdmin: boolean;
}

const OrgPost: React.FC<OrgPostProps> = ({ post, onDeletePost, isAdmin }) => {
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);

  const handleAction = (action: string) => {
    if (action === 'Delete' && onDeletePost) {
      onDeletePost(post);
    }
  };

  const menuItems = isAdmin ? ['Delete'] : [];

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.organization.profile_photo} alt={post.organization.name} />
            <AvatarFallback>{post.organization.name ? post.organization.name.charAt(0) : '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.organization.name}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">{timeSince(post.created_at)}</div>
          {isAdmin && menuItems.length > 0 && (
            <MoreMenu
              menuItems={menuItems}
              isOwner={true}
              onAction={handleAction}
              onSubscribe={() => {}}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-auto mt-4">
            <Image
              src={post.image_url}
              alt="Post image"
              layout="responsive"
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center cursor-pointer" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="mr-1" />
          <span>{post.comment_count}</span>
        </div>
        <Reaction
          issueId={post.id}
          initialReactions={post.reactions}
          userReaction={post.reactions.find((r: any) => r.user_id === user?.user_id)}
        />
      </CardFooter>
      {showComments && (
        <CommentList
          issueId={parseInt(post.id, 10)}
          parentCommentId={null}
          showAddComment={true}
          showComments={true}
        />
      )}
    </Card>
  );
};

export default OrgPost;