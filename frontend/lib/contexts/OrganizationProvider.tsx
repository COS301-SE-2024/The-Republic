'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization } from '../types';

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
        members: 1500,
        userIsMember: true,
        logo: 'https://via.placeholder.com/64?text=ZCC',
        website: 'https://zcc.com',
        isAdmin: true, // User is an admin of this org
      },
      {
        id: 2,
        name: 'ArsenalRecruiters',
        description: 'A powerful organization about blah blah blah',
        members: 9051,
        userIsMember: false,
        logo: 'https://via.placeholder.com/64?text=Arsenal',
        website: 'https://arsenalrecruiters.com',
        isAdmin: false, // User is not an admin
      },
      // Add more organizations as needed
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