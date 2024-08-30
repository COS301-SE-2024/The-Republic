'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OrganizationDetail from '../../../../components/OrganizationDetail/OrganizationDetail';
import { Organization, AnalyticsData } from '../../../../lib/types';
import { useOrganizations } from '@/lib/contexts/OrganizationProvider';
//import { useUser } from '../../../../lib/contexts/UserContext';

const mockAnalytics: AnalyticsData[] = [
  { date: '2024-01-01', issuesResolved: 10, interactions: 50 },
  { date: '2024-02-01', issuesResolved: 15, interactions: 75 },
  { date: '2024-03-01', issuesResolved: 20, interactions: 100 },
];

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { organizations } = useOrganizations();
  //const { user } = useUser();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const org = organizations.find(org => org.id === Number(id));
      setOrganization(org || null);
    }
  }, [id, organizations]);

  if (!organization) {
    return <div className="p-5">Organization not found</div>;
  }

  // Check if the user is an admin of the organization
  //const isAdmin = user
   // ? organization.members.some(member => member.id === Number(user.user_id) && member.isAdmin)
   // : false;

  return <OrganizationDetail organization={organization} analytics={mockAnalytics} isAdmin={true} />;
}