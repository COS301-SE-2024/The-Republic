import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Organization, UserAlt } from '@/lib/types';
import { getJoinRequests } from '@/lib/api/getJoinRequests';
import { handleJoinRequest } from '@/lib/api/handleJoinRequest';
import { useToast } from '@/components/ui/use-toast';
import { timeSince } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface JoinRequest {
  id: number;
  organization_id: string;
  user_id: string;
  status: string;
  created_at: string;
  user: UserAlt;
}

interface JoinRequestsTabProps {
  organization: Organization;
  onJoinRequestsUpdate: () => void;
}

export default function JoinRequestsTab({ organization, onJoinRequestsUpdate }: JoinRequestsTabProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await getJoinRequests(user, organization.id);
      setJoinRequests(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching join requests:", err);
      setError('Failed to fetch join requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: number, accept: boolean, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) return;
    try {
      await handleJoinRequest(user, organization.id, requestId, accept);
      toast({
        title: "Success",
        description: `Join request ${accept ? 'accepted' : 'rejected'} successfully`,
      });
      fetchJoinRequests(); // Refresh the list
      onJoinRequestsUpdate(); // Update parent component
    } catch (err) {
      console.error("Error handling join request:", err);
      toast({
        title: "Error",
        description: "Failed to handle join request",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }
  
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {joinRequests.length === 0 ? (
          <p>No pending join requests.</p>
        ) : (
          <div className="space-y-4">
            {joinRequests.map((request) => (
              <div 
                key={request.id} 
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200"
                onClick={() => handleRowClick(request.user_id)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={request.user.image_url} />
                    <AvatarFallback>{request.user.fullname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{request.user.fullname}</p>
                    <p className="text-sm text-gray-500">
                      Requested: {timeSince(request.created_at)} ago
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button onClick={(e) => handleRequest(request.id, true, e)} variant="default">
                    Accept
                  </Button>
                  <Button onClick={(e) => handleRequest(request.id, false, e)} variant="destructive">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}