"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/lib/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationHeader from '@/components/OrganizationHeader/OrganizationHeader';
import InformationTab from '@/components/OrganizationTabs/InformationTab';
import MembersTab from '@/components/OrganizationTabs/MembersTab';
import SettingsTab from '@/components/OrganizationTabs/SettingsTab';
import JoinRequestsTab from '@/components/OrganizationTabs/JoinRequestsTab';
import { Organization, OrganizationPost, UserAlt } from '@/lib/types';
import { getOrganizationById } from '@/lib/api/getOrganizationById';
import { getOrganizationPosts } from '@/lib/api/getOrganizationPosts';
import { getOrganizationMembers } from '@/lib/api/getOrganizationMembers';
import { getTopOrganizationMembers } from '@/lib/api/getTopOrganizationMembers';
import { joinOrganization } from '@/lib/api/joinOrganization';
import { getJoinRequestByUser } from '@/lib/api/getJoinRequestByUser';

interface OrganizationMember {
  id: number;
  organization_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: UserAlt;
}

export default function OrganizationPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgPosts, setOrgPosts] = useState<OrganizationPost[]>([]);
  const [members, setMembers] = useState<{ data: OrganizationMember[], total: number }>({ data: [], total: 0 });
  const [topActiveMembers, setTopActiveMembers] = useState<UserAlt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserMember, setIsUserMember] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [hasUserRequested, setHasUserRequested] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user || !id) return;
    try {
      setLoading(true);
      const [orgData, postsData, membersData, joinRequest] = await Promise.all([
        getOrganizationById(user, id as string).catch((err) => {
          console.error("Error fetching organization data:", err);
          return null;
        }),
        getOrganizationPosts(user, id as string).catch((err) => {
          console.error("Error fetching organization posts:", err);
          return { data: [] };
        }),
        getOrganizationMembers(user, id as string).catch((err) => {
          console.error("Error fetching organization members:", err);
          return { data: [], total: 0 };
        }),
        getJoinRequestByUser(user, id as string).catch((err) => {
          console.error("Error fetching join request:", err);
          return null;
        }),
      ]);
  
      if (orgData) {
        setOrganization(orgData);
      } else {
        setError('Failed to fetch organization data');
      }
  
      setOrgPosts(postsData.data || []);
  
      const userMember = membersData.data.find(member => member.user_id === user.user_id);
      setIsUserMember(!!userMember);
      setIsUserAdmin(userMember?.role === 'admin');
      setHasUserRequested(!!joinRequest);
  
      if (userMember) {
        const [topMembersData] = await Promise.all([
          getTopOrganizationMembers(user, id as string).catch((err) => {
            console.error("Error fetching top members:", err);
            return [];
          }),
        ]);
        setMembers(membersData);
        setTopActiveMembers(Array.isArray(topMembersData) ? topMembersData : []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (organization) {
      setShowJoinRequests(organization.join_policy === 'request' && isUserAdmin);
    }
  }, [organization, isUserAdmin]);

  const handleJoinRequest = async () => {
    if (!user || !organization) return;
    try {
      await joinOrganization(user, organization.id);
      setHasUserRequested(true);
      fetchData();
    } catch (err) {
      console.error("Error joining organization:", err);
      setError('Failed to join organization. Please try again.');
    }
  };

  const handleOrganizationUpdate = async () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (error || !organization) return <div>Error: {error || 'Organization not found'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <OrganizationHeader 
        organization={organization}
        isUserMember={isUserMember}
        onJoinRequest={handleJoinRequest}
        hasUserRequested={hasUserRequested}
      />
      
      {isUserMember ? (
        <Tabs defaultValue="information" className="mt-6">
          <TabsList className="bg-green-100 p-1 rounded-lg">
            <TabsTrigger value="information" className="data-[state=active]:bg-white data-[state=active]:text-green-600">Information</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:text-green-600">Members</TabsTrigger>
            {showJoinRequests && (
              <TabsTrigger value="join-requests" className="data-[state=active]:bg-white data-[state=active]:text-green-600">Join Requests</TabsTrigger>
            )}
            {isUserAdmin && (
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-green-600">Settings</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="information">
            <InformationTab 
              organization={organization} 
              orgPosts={orgPosts} 
              topActiveMembers={topActiveMembers}
              setOrgPosts={setOrgPosts}
              isUserAdmin={isUserAdmin}
            />
          </TabsContent>
          <TabsContent value="members">
            <MembersTab 
              organization={organization} 
              members={members}
              setMembers={setMembers}
            />
          </TabsContent>
          {showJoinRequests && (
            <TabsContent value="join-requests">
              <JoinRequestsTab 
                organization={organization}
                onJoinRequestsUpdate={fetchData}
              />
            </TabsContent>
          )}
          {isUserAdmin && (
            <TabsContent value="settings">
              <SettingsTab 
                organization={organization}
                onOrganizationUpdate={handleOrganizationUpdate}
              />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="mt-6">
          <InformationTab 
            organization={organization} 
            orgPosts={orgPosts} 
            topActiveMembers={[]}
            setOrgPosts={setOrgPosts}
            isUserAdmin={false}
          />
        </div>
      )}
    </div>
  );
}