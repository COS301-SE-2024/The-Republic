"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OrganizationDetail from '../../../../components/OrganizationDetail/OrganizationDetail';
import { Organization, AnalyticsData } from '../../../../lib/types';

const organizations: Organization[] = [
  { id: 1, name: 'ZCC', description: "A powerful organization about blah blah blah", members: 1500, userIsMember: true },
  { id: 2, name: 'ArsenalRecruiters', description: "A powerful organization about blah blah blah", members: 9051, userIsMember: false },
  { id: 3, name: 'Betway', description: "A powerful organization about blah blah blah", members: 4368, userIsMember: true },
  { id: 4, name: 'ANC', description: "A powerful organization about blah blah blah", members: 5494, userIsMember: false },
];

const mockAnalytics: AnalyticsData[] = [
  { date: '2024-01-01', issuesResolved: 10, interactions: 50 },
  { date: '2024-02-01', issuesResolved: 15, interactions: 75 },
  { date: '2024-03-01', issuesResolved: 20, interactions: 100 },
];

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const org = organizations.find(org => org.id === Number(id));
      setOrganization(org || null);
    }
  }, [id]);

  if (!organization) {
    return <div className="p-5">Organization not found</div>;
  }

  return <OrganizationDetail organization={organization} analytics={mockAnalytics} />;
}