'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization } from '../../lib/types';

// Context
const OrganizationContext = createContext<{
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  addOrganization: (org: Organization) => void;
  deleteOrganization: (id: number) => void;
}>({
  organizations: [],
  setOrganizations: () => {},
  addOrganization: () => {},
  deleteOrganization: () => {},
});

// Provider Component
export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const mockOrganizations: Organization[] = [
      {
        id: 1,
        name: 'ZCC',
        description: 'A powerful organization about blah blah blah',
        memberCount: 1500,
        userIsMember: true,
        logo: 'https://via.placeholder.com/64?text=ZCC',
        website: 'https://zcc.com',
        isPrivate: false,
        isAdmin: true,
        members: [
          { 
            id: 1, 
            name: 'John Doe', 
            email: 'johndoe@example.com', 
            username: 'johnd',
            imageUrl: '/path-to-avatar.jpg',
            isAdmin: true 
          },
          { 
            id: 2, 
            name: 'Timothy Tester', 
            email: 'Shamakamina@icloud.com', 
            username: 'timtester',
            imageUrl: '/path-to-avatar.jpg',
            isAdmin: true 
          },
          { 
            id: 3, 
            name: 'Jane Doe', 
            email: 'janedoe@example.com', 
            username: 'janed',
            imageUrl: '/path-to-avatar.jpg',
            isAdmin: false 
          },
        ],
        joinRequests: [
          { id: 1, userId: 101, name: 'Alice',  username: 'Alice', requestDate: '2024-08-01' },
          { id: 2, userId: 102, name: 'Bob', username: 'Bob', requestDate: '2024-08-02' },
        ],
        joinPolicy: 'open', 
      },
      {
        id: 2,
        name: 'ArsenalRecruiters',
        description: 'A powerful organization about blah blah blah',
        memberCount: 9051,
        userIsMember: false,
        logo: 'https://via.placeholder.com/64?text=Arsenal',
        website: 'https://arsenalrecruiters.com',
        isPrivate: true,
        isAdmin: false,
        members: [
          { 
            id: 3, 
            name: 'Jack Smith', 
            email: 'jacksmith@example.com', 
            username: 'jacks',
            imageUrl: '/path-to-avatar.jpg',
            isAdmin: true 
          },
          { 
            id: 5, 
            name: 'Emily White', 
            email: 'emilywhite@example.com', 
            username: 'emilyw',
            imageUrl: '/path-to-avatar.jpg',
            isAdmin: false 
          },
        ],
        joinRequests: [
          { id: 3, userId: 103, name: 'Charlie',  username: 'Charlie', requestDate: '2024-08-03' },
          { id: 4, userId: 104, name: 'Diana',  username: 'Diana', requestDate: '2024-08-04' },
        ],
        joinPolicy: 'closed',
      },
    ];
    

    setOrganizations(mockOrganizations);
  }, []);

  const addOrganization = (org: Organization) => {
    setOrganizations((prevOrgs) => [...prevOrgs, org]);
  };

  const deleteOrganization = (id: number) => {
    setOrganizations((prevOrgs) => prevOrgs.filter(org => org.id !== id));
  };

  return (
    <OrganizationContext.Provider value={{ organizations, setOrganizations, addOrganization, deleteOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Custom hook for using the context
export const useOrganizations = () => useContext(OrganizationContext);