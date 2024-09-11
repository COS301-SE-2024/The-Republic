import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from 'lucide-react';
import { timeSince } from "@/lib/utils";
import Reaction from "../Reaction/Reaction";
import Image from "next/image";
import MoreMenu from "../MoreMenu/MoreMenu";
import { Organization, OrganizationPost } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface OrgPostProps {
  organization: Organization;
  post: OrganizationPost;
  onDeletePost?: (post: OrganizationPost) => void;
  isAdmin: boolean;
  isMember: boolean;
}

const OrgPost: React.FC<OrgPostProps> = ({ organization, post, onDeletePost, isAdmin, isMember }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    if (action === 'Delete' && onDeletePost) {
      onDeletePost(post);
    }
  };

  const menuItems = isAdmin ? ['Delete'] : [];

  // Safely transform post.reactions.counts object to an array
  const initialReactions = React.useMemo(() => {
    const counts = post.reactions?.counts || {};
    return Object.entries(counts).map(([emoji, count]) => ({
      emoji,
      count: typeof count === 'number' ? count : 0,
    }));
  }, [post.reactions]);

  const handleCommentClick = () => {
    if (isMember) {
      router.push(`/organization/${organization.id}/posts/${post.post_id}`);
    } else {
      toast({
        title: "Access Denied",
        description: "Only members can view and add comments.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4 rounded">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={organization.profile_photo} alt={organization.name} />
            <AvatarFallback>{organization.name ? organization.name.charAt(0) : '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{organization.name}</div>
            {organization.username && (
              <div className="text-sm text-muted-foreground">@{organization.username}</div>
            )}
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
        <div className="flex items-center cursor-pointer" onClick={handleCommentClick}>
          <MessageCircle className="mr-1" />
          <span>{post.comment_count ?? 0}</span>
        </div>
        {isMember && (
          <Reaction
            itemId={post.post_id}
            itemType="post"
            initialReactions={initialReactions}
            userReaction={post.reactions?.userReaction}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default OrgPost;