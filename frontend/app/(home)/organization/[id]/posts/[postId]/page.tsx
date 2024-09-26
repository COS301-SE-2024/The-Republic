"use client";

import { useParams } from "next/navigation";
import { OrganizationPost, Organization } from "@/lib/types";
import OrgPost from "@/components/OrgPost/OrgPost";
import CommentList from "@/components/Comment/CommentList";
import { fetchOrganizationData } from '@/lib/api/fetchOrganizationData';
import { fetchOrganizationPost } from '@/lib/api/fetchOrganizationPost';
import { checkUserMembership } from '@/lib/api/checkUserMembership';
import { useUser } from '@/lib/contexts/UserContext';
import { useEffect, useState } from "react";
import { Loader2 } from 'lucide-react';

const OrganizationPostPage = () => {
  const params = useParams();
  const organizationId = params.id as string;
  const postId = params.postId as string;
  const { user } = useUser();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [post, setPost] = useState<OrganizationPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (!organizationId || !postId) {
        setError("Missing organization ID or post ID");
        setLoading(false);
        return;
      }

      try {
        const [orgData, postData, membershipStatus] = await Promise.all([
          fetchOrganizationData(user, organizationId),
          fetchOrganizationPost(user, organizationId, postId),
          checkUserMembership(user, organizationId)
        ]);

        setOrganization(orgData);
        setPost(postData);
        setIsMember(membershipStatus);
        setIsAdmin(orgData.isAdmin);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user, organizationId, postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <h3 className="text-xlg text-red-500">{error}</h3>
      </div>
    );
  }

  if (!organization || !post) {
    return (
      <div className="flex justify-center items-center h-full">
        <h3 className="text-xlg">No data available</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <OrgPost
        organization={organization}
        post={post}
        isAdmin={isAdmin}
        isMember={isMember}
      />
      <CommentList
        itemId={postId}
        itemType="post"
        parentCommentId={null}
        showAddComment={isMember}
      />
    </div>
  );
};

export default OrganizationPostPage;