import { useState, useEffect } from 'react';
import { Organization, OrganizationPost, UserAlt as User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Clock, Tag } from 'lucide-react';
import OrgPost from '@/components/OrgPost/OrgPost';
import { useUser } from '@/lib/contexts/UserContext';
import { getOrganizationPosts } from '@/lib/api/getOrganizationPosts';
import { getTopOrganizationMembers } from '@/lib/api/getTopOrganizationMembers';
import { createOrganizationPost } from '@/lib/api/createOrganizationPost';
import { deleteOrganizationPost } from '@/lib/api/deleteOrganizationPost';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '../ui/use-toast';

interface InformationTabProps {
  organization: Organization;
  orgPosts: OrganizationPost[];
  topActiveMembers: User[];
  setOrgPosts: React.Dispatch<React.SetStateAction<OrganizationPost[]>>;
}

export default function InformationTab({ organization, orgPosts, topActiveMembers, setOrgPosts }: InformationTabProps) {
    const { user } = useUser();
    const [newPostContent, setNewPostContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCreatePost = async () => {
      if (!user || !newPostContent.trim()) return;
      try {
        const newPost = await createOrganizationPost(user, organization.id, newPostContent);
        setOrgPosts(prevPosts => [newPost, ...prevPosts]);
        setNewPostContent('');
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      } catch (err) {
        console.error("Error creating post:", err);
        toast({
          title: "Error",
          description: "Failed to create post",
          variant: "destructive",
        });
      }
    };
  
    const handleDeletePost = async (postId: string) => {
      if (!user) return;
      try {
        await deleteOrganizationPost(user, organization.id, postId);
        setOrgPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting post:", err);
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    };

  // Mock analytics data (replace with actual data fetching logic later)
  const analyticsData = {
    mainCategories: ['Environment', 'Education', 'Healthcare'],
    activeLocations: ['New York', 'Los Angeles', 'Chicago'],
    issueResolutionTime: '3.5 days',
  };


  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Organization Posts - Spans 2 columns and full height */}
      <Card className="col-span-2 row-span-3 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-blue-500">
        <CardHeader>
          <CardTitle className="text-green-800">Organization Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Write a new post..."
              className="w-full mb-2"
            />
            <Button onClick={handleCreatePost}>Create Post</Button>
          </div>
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            {orgPosts && orgPosts.length > 0 ? (
              orgPosts.map((post: OrganizationPost) => (
                <OrgPost 
                  key={post.post_id} 
                  post={{
                    id: post.post_id,
                    content: post.content,
                    created_at: post.created_at,
                    image_url: post.image_url || '',
                    organization: {
                      id: organization.id,
                      name: organization.name,
                      profile_photo: organization.profile_photo
                    },
                    reactions: [], // Add proper reactions data if available
                    comment_count: 0 // Add proper comment count if available
                  }}
                  onDeletePost={() => handleDeletePost(post.post_id)}
                  isAdmin={organization.admins_ids?.includes(user?.user_id || '') || false}
                />
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Active Members - Spans 2 columns */}
      <Card className="col-span-2 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Users className="mr-2 h-5 w-5" />
            Most Active Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topActiveMembers.length > 0 ? (
            <ul className="space-y-4">
              {topActiveMembers.map((member) => (
                <li key={member.user_id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.image_url} alt={member.fullname} />
                      <AvatarFallback>{member.fullname.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.fullname}</span>
                  </div>
                  {/* <span className="text-sm text-gray-500">{member.activity_count} actions</span> */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No active members to display.</p>
          )}
        </CardContent>
      </Card>

      {/* Main Focus Areas */}
      <Card className="col-span-2 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Tag className="mr-2 h-5 w-5" />
            Main Focus Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {analyticsData.mainCategories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Active Locations */}
      <Card className="col-span-1 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <MapPin className="mr-2 h-5 w-5" />
            Active Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {analyticsData.activeLocations.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Average Issue Resolution Time */}
      <Card className="col-span-1 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Clock className="mr-2 h-5 w-5" />
            Typical Resolution Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{analyticsData.issueResolutionTime}</p>
        </CardContent>
      </Card>
    </div>
  );
}