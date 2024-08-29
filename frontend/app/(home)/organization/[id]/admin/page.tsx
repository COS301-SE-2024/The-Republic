'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrganizations } from '@/lib/contexts/OrganizationProvider';
import { Organization, AnalyticsData } from '../../../../../lib/types';
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard';
import { useUser } from '../../../../../lib/contexts/UserContext';

export default function AdminOrganizationPage() {
  const params = useParams();
  const { user } = useUser(); 
  const { organizations } = useOrganizations();
  const id = Number(params.id);

  const organization = organizations.find(org => org.id === id);

  if (!organization || !organization.isAdmin) {
    return <div className="p-5">You do not have permission to access this page.</div>;
  }

  const isAdmin = user
  ? organization.members.some(member => member.id === Number(user.user_id) && member.isAdmin)
  : false;

  return <AdminDashboard organization={organization} />;
}
