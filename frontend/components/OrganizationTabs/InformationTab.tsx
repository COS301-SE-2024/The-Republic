import { useState, useEffect } from 'react';
import { Organization, OrganizationPost} from '@/lib/types';
import { deleteOrganizationPost } from '@/lib/api/deleteOrganizationPost';
import { checkUserMembership } from '@/lib/api/checkUserMembership';
import { requestReport } from '@/lib/api/requestReport'; 
import { useUser } from '@/lib/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenSquare, Star, BarChart, PieChart } from 'lucide-react';
import OrgPost from '@/components/OrgPost/OrgPost';
import CreateOrgPost from '@/components/CreatePost/CreatePost';
import { useToast } from '../ui/use-toast';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface InformationTabProps {
  organization: Organization;
  orgPosts: OrganizationPost[];
  setOrgPosts: React.Dispatch<React.SetStateAction<OrganizationPost[]>>;
  isUserAdmin: boolean;
}

export default function InformationTab({ 
  organization, 
  orgPosts, 
  setOrgPosts,
  isUserAdmin
}: InformationTabProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportEmail, setReportEmail] = useState('');

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
          title: "Something Went Wrong",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    };

    const handleReportRequest = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        toast({
          title: "Something Went Wrong",
          description: "You must be signed in to request a report",
          variant: "destructive",
        });
        return;
      }
      try {
        await requestReport(user, organization.id, reportEmail);
        toast({
          title: "Report Requested",
          description: `A detailed report will be sent to ${reportEmail}`,
        });
        setShowReportModal(false);
        setReportEmail('');
      } catch (error) {
        console.error("Error requesting report:", error);
        toast({
          title: "Something Went Wrong",
          description: "Failed to request report",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 row-span-2 border-l-4 border-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-green-800 flex items-center">
              <PenSquare className="w-5 h-5 mr-2" />
              Organization Posts
            </CardTitle>
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
            <div className="overflow-auto max-h-[calc(100vh-300px)] space-y-4">
              {orgPosts && orgPosts.length > 0 ? (
                orgPosts.map((post: OrganizationPost) => (
                  <OrgPost
                    key={post.post_id}
                    post={post}
                    onDeletePost={() => handleDeletePost(post.post_id)}
                    isAdmin={isUserAdmin}
                    organization={organization} 
                    isMember={isMember}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No posts available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-l-4 border-purple-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800 dark:text-purple-300">
              <BarChart className="mr-2 h-5 w-5" />
              Unlock Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Dive deep into this organization's performance!
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Most active members</li>
              <li>Issue resolution efficiency</li>
              <li>Top-performing categories</li>
              <li>Granular insights into the organization's performance</li>
            </ul>
            <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PieChart className="w-4 h-4 mr-2" />
                  Get Your Detailed Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Your Detailed Report</DialogTitle>
                  <DialogDescription>
                    Enter your email to receive a comprehensive analysis of your organization's performance.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleReportRequest} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">Send Me The Report</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-l-4 border-yellow-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Star className="mr-2 h-5 w-5" />
              Satisfaction Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organization.averageSatisfactionRating !== null && organization.averageSatisfactionRating !== undefined ? (
              <>
                <p className="text-4xl font-bold">{organization.averageSatisfactionRating.toFixed(1)}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-6 h-6 ${
                        index < Math.round(organization.averageSatisfactionRating ?? 0)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-lg text-gray-500">Not enough data</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
}