import { useState, useEffect } from 'react';
import { Organization, OrganizationPost, UserAlt as User } from '@/lib/types';
import { deleteOrganizationPost } from '@/lib/api/deleteOrganizationPost';
import { checkUserMembership } from '@/lib/api/checkUserMembership';
import { useUser } from '@/lib/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Tag, PenSquare, Star } from 'lucide-react';
import OrgPost from '@/components/OrgPost/OrgPost';
import CreateOrgPost from '@/components/CreatePost/CreatePost';
import { useToast } from '../ui/use-toast';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface InformationTabProps {
  organization: Organization;
  orgPosts: OrganizationPost[];
  topActiveMembers: User[];
  setOrgPosts: React.Dispatch<React.SetStateAction<OrganizationPost[]>>;
  isUserAdmin: boolean;
}

export default function InformationTab({ 
  organization, 
  orgPosts, 
  topActiveMembers, 
  setOrgPosts,
  isUserAdmin
}: InformationTabProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
      const fetchMembershipStatus = async () => {
        if (user && organization) {
          try {
            const membershipStatus = await checkUserMembership(user, organization.id);
            setIsMember(membershipStatus);
          } catch (error) {
            console.error("Error checking membership status:", error);
          }
        }
      };

      fetchMembershipStatus();
    }, [user, organization]);

    const handlePostCreated = (newPost: OrganizationPost) => {
      setOrgPosts(prevPosts => [newPost, ...prevPosts]);
      setShowCreatePost(false);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Organization Posts</CardTitle>
          {isUserAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreatePost(!showCreatePost)}
            >
              <PenSquare className="w-5 h-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {showCreatePost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <CreateOrgPost 
                  organization={organization}
                  onPostCreated={handlePostCreated}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
          {orgPosts && orgPosts.length > 0 ? (
                orgPosts.map((post: OrganizationPost) => (
                  <OrgPost
                    key={post.post_id}
                    post={post}
                    onDeletePost={() => handleDeletePost(post.post_id)}
                    isAdmin={isUserAdmin}
                    organization={organization} 
                    isMember={isMember}                  />
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

      {/* Average Satisfaction Rating */}
      <Card className="col-span-1 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Star className="mr-2 h-5 w-5" />
              Satisfaction Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organization.averageSatisfactionRating !== null && organization.averageSatisfactionRating !== undefined ? (
              <p className="text-2xl font-bold">{organization.averageSatisfactionRating.toFixed(1)} / 5</p>
            ) : (
              <p className="text-sm text-gray-500">Not enough data</p>
            )}
          </CardContent>
        </Card>
    </div>
  );
}