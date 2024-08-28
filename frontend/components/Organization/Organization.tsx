'use client';

import React, { useState, MouseEvent } from 'react';
import { Organization } from '../../lib/types';
import { FaEllipsisH } from "react-icons/fa";

interface OrganizationProps {
  onOrganizationClick: (id: number) => void;
  filter: 'userOnly' | 'all';
  organizations: Organization[];
}


const organizations: Organization[] = [
  { id: 1, name: 'ZCC', description: "A powerful organization about blah blah blah", members: 1500, userIsMember: true, logo: 'https://via.placeholder.com/64?text=ZCC', website: 'https://zcc.com' },
  { id: 2, name: 'ArsenalRecruiters', description: "A powerful organization about blah blah blah", members: 9051, userIsMember: false, logo: 'https://via.placeholder.com/64?text=Arsenal', website: 'https://arsenalrecruiters.com' },
  { id: 3, name: 'Betway', description: "A powerful organization about blah blah blah", members: 4368, userIsMember: true, logo: 'https://via.placeholder.com/64?text=Betway', website: 'https://betway.com' },
  { id: 4, name: 'ANC', description: "A powerful organization about blah blah blah", members: 5494, userIsMember: false, logo: 'https://via.placeholder.com/64?text=ANC', website: 'https://anc.com' },
];

const Organizations: React.FC<OrganizationProps> = ({ onOrganizationClick, filter, organizations }) => {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  
  const filteredOrganizations = filter === 'all'
    ? organizations
    : organizations.filter(org => org.userIsMember);

  const handleMenuClick = (e: MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent the click from bubbling up and triggering navigation
    setShowMenu(showMenu === id ? null : id); // Toggle the menu
  };

  const handleJoinClick = (id: number) => {
    console.log(`Join organization ${id}`);
    // Add join logic here
  };

  const handleRequestToJoinClick = (id: number) => {
    console.log(`Request to join organization ${id}`);
    // Add request-to-join logic here
  };

  return (
    <div className="space-y-4">
      {filteredOrganizations.map((org) => (
        <div
          key={org.id}
          className="relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
          onClick={() => onOrganizationClick(org.id)}
        >
          <div className="flex items-center space-x-4">
            {/* Displaying only the name and description, not the logo and website */}
            <div>
              <h2 className="font-bold text-black dark:text-white">{org.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{org.members} members</p>
            </div>
          </div>
          {!org.userIsMember && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <FaEllipsisH
                className="text-gray-500 cursor-pointer w-5 h-5"
                onClick={(e) => handleMenuClick(e, org.id)}
              />
              {showMenu === org.id && (
                <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                  <button
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleJoinClick(org.id)}
                  >
                    Join
                  </button>
                  <button
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleRequestToJoinClick(org.id)}
                  >
                    Request to Join
                  </button>
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
