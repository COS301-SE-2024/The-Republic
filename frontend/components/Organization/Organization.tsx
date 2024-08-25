'use client';

import React from 'react';
import { Organization } from '../../lib/types';

interface OrganizationProps {
  onOrganizationClick: (id: number) => void;
  filter: 'all' | 'userOnly';
}

const organizations: Organization[] = [
  { id: 1, name: 'ZCC', description:"A powerful organization about blah blah blah", members: 1500, userIsMember: true },
  { id: 2, name: 'ArsenalRecruiters',description:"A powerful organization about blah blah blah", members: 9051, userIsMember: false },
  { id: 3, name: 'Betway', description:"A powerful organization about blah blah blah", members: 4368, userIsMember: true },
  { id: 4, name: 'ANC', description:"A powerful organization about blah blah blah", members: 5494, userIsMember: false },
];

const Organizations: React.FC<OrganizationProps> = ({ onOrganizationClick, filter }) => {
  const filteredOrganizations = filter === 'all' 
    ? organizations 
    : organizations.filter(org => org.userIsMember);

  return (
    <div className="space-y-4">
      {filteredOrganizations.map((org) => (
        <div
          key={org.id}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
          onClick={() => onOrganizationClick(org.id)}
        >
          <h2 className="font-bold text-black dark:text-white">{org.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{org.members} members</p>
        </div>
      ))}
    </div>
  );
};

export default Organizations;
