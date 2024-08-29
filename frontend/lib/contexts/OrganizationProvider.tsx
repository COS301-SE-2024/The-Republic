'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
          { id: 1, name: 'John Doe', email: 'johndoe@example.com', isAdmin: true },
          { id: 2, name: 'Timothy Tester', email: 'Shamakamina@icloud.com', isAdmin: true },
          { id: 3, name: 'Jane Doe', email: 'janedoe@example.com', isAdmin: false },
        ],
        joinRequests: [
          { id: 1, userId: 101, userName: 'Alice', requestDate: '2024-08-01' },
          { id: 2, userId: 102, userName: 'Bob', requestDate: '2024-08-02' },
        ],
        joinPolicy: 'open', 
      },
      {
        id: 2,
        name: 'ArsenalRecruiters',
        description: 'A powerful organization about blah blah blah',
        memberCount: 9051,
        userIsMember: true,
        logo: 'https://via.placeholder.com/64?text=Arsenal',
        website: 'https://arsenalrecruiters.com',
        isPrivate: true,
        isAdmin: false,
        members: [
          { id: 3, name: 'Jack Smith', email: 'jacksmith@example.com', isAdmin: true },
          { id: 5, name: 'Emily White', email: 'emilywhite@example.com', isAdmin: false },
        ],
        joinRequests: [
          { id: 3, userId: 103, userName: 'Charlie', requestDate: '2024-08-03' },
          { id: 4, userId: 104, userName: 'Diana', requestDate: '2024-08-04' },
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
