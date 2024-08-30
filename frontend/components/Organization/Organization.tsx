'use client';

import React, { useState } from 'react';
import { Organization } from '../../lib/types';

interface OrganizationProps {
  onOrganizationClick: (id: number) => void;
  filter: 'userOnly' | 'all';
  organizations: Organization[];
  userRole: 'admin' | 'member';
}

const Organizations: React.FC<OrganizationProps> = ({ onOrganizationClick, filter, organizations, userRole }) => {
  const [showMenu] = useState<number | null>(null);
  
  const filteredOrganizations = filter === 'all'
    ? organizations
    : organizations.filter(org => org.userIsMember);

  



  const handleManageClick = (id: number) => {
    console.log(`Manage organization ${id}`);
    window.location.href = `/organization/${id}/admin`;
  };

  return (
    <div className="space-y-4">
      {filteredOrganizations.map((org) => (
        <div
          key={org.id}
          className="relative cursor-pointer hover:bg-gray-100 dark:hover:bg-grey p-2 rounded"
          onClick={() => onOrganizationClick(org.id)}
        >
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="font-bold text-black dark:text-white">{org.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{org.memberCount} members</p>
            </div>
          </div>
          {!org.userIsMember && (
            <div className="absolute top-2 right-2 flex space-x-2">
              
              {showMenu === org.id && (
                <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                  
                  {userRole === 'admin' && (
                    <button
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleManageClick(org.id)}
                    >
                      Manage Organization
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Organizations;
