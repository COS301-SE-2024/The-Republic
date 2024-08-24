'use client';

import React from 'react';

interface Organization {
  id: number;
  name: string;
  description: string;
  members: number;
  userIsMember: boolean;
}

interface OrganizationProps {
  onOrganizationClick: (id: number) => void;
  filter: 'all' | 'userOnly';
}

const organizations: Organization[] = [
  { id: 1, name: 'Organization 1', description: 'Description 1', members: 10, userIsMember: true },
  { id: 2, name: 'Organization 2', description: 'Description 2', members: 15, userIsMember: false },
  { id: 3, name: 'Organization 3', description: 'Description 3', members: 20, userIsMember: true },
];

const Organizations: React.FC<OrganizationProps> = ({ onOrganizationClick, filter }) => {
  const filteredOrganizations = filter === 'all' 
    ? organizations 
    : organizations.filter(org => org.userIsMember);

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Description</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Members</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrganizations.map((org) => (
            <tr
              key={org.id}
              className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => onOrganizationClick(org.id)}
            >
              <td className="p-3 text-sm text-gray-700">{org.name}</td>
              <td className="p-3 text-sm text-gray-700">{org.description}</td>
              <td className="p-3 text-sm text-gray-700">{org.members}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Organizations;