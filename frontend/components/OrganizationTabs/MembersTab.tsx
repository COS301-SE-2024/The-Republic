import React from 'react';
import { Organization, UserAlt } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { removeMember } from '@/lib/api/removeMember';
import { leaveOrganization } from '@/lib/api/leaveOrganization';
import { promoteToAdmin } from '@/lib/api/promoteToAdmin';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface OrganizationMember {
  id: number;
  organization_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: UserAlt;
}

interface MembersTabProps {
  organization: Organization;
  members: {
    data: OrganizationMember[];
    total: number;
  };
  setMembers: React.Dispatch<React.SetStateAction<{
    data: OrganizationMember[];
    total: number;
  }>>;
}

export default function MembersTab({ organization, members, setMembers }: MembersTabProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const isAdmin = user && members.data.find(member => member.user_id === user.user_id)?.role === 'admin';

  const handleRemoveMember = async (memberId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user || !isAdmin) return;
    try {
      await removeMember(user, organization.id, memberId);
      setMembers(prevMembers => ({
        ...prevMembers,
        data: prevMembers.data.filter(member => member.user_id !== memberId),
        total: prevMembers.total - 1
      }));
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (err) {
      console.error("Error removing member:", err);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleLeaveOrganization = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) return;
    try {
      await leaveOrganization(user, organization.id);
      // Redirect user or update UI as needed
      router.push('/');
    } catch (err) {
      console.error("Error leaving organization:", err);
      toast({
        title: "Error",
        description: "Failed to leave organization",
        variant: "destructive",
      });
    }
  };

  const handlePromoteToAdmin = async (memberId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user || !isAdmin) return;
    try {
      await promoteToAdmin(user, organization.id, memberId);
      setMembers(prevMembers => ({
        ...prevMembers,
        data: prevMembers.data.map(member => 
          member.user_id === memberId ? { ...member, role: 'admin' } : member
        )
      }));
    } catch (err) {
      console.error("Error promoting member to admin:", err);
      toast({
        title: "Error",
        description: "Failed to promote member to admin",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (!members.data) return <div>Loading members...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({members.total})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.data.map((member) => (
            <div 
              key={member.user_id} 
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200"
              onClick={() => handleRowClick(member.user_id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.user.image_url} />
                  <AvatarFallback>{member.user.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{member.user.fullname}</p>
                  <p className="text-sm text-gray-500">{member.role === 'admin' ? 'Admin' : 'Member'}</p>
                </div>
              </div>
              <div className="space-x-2">
                {isAdmin && user?.user_id !== member.user_id && (
                  <>
                    <Button variant="destructive" onClick={(e) => handleRemoveMember(member.user_id, e)}>
                      Remove
                    </Button>
                    {member.role !== 'admin' && (
                      <Button onClick={(e) => handlePromoteToAdmin(member.user_id, e)}>
                        Promote to Admin
                      </Button>
                    )}
                  </>
                )}
                {user?.user_id === member.user_id && (
                  <Button variant="secondary" onClick={handleLeaveOrganization}>
                    Leave Organization
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}