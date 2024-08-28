'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization } from '../types';

// Context
const OrganizationContext = createContext<{
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  addOrganization: (org: Organization) => void;
}>({
  organizations: [],
  setOrganizations: () => {},
  addOrganization: () => {},
});

// Provider Component
export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    // Set mock organizations
    const mockOrganizations: Organization[] = [
      {
        id: 1,
        name: 'ZCC',
        description: 'A powerful organization about blah blah blah',
        members: 1500,
        userIsMember: true,
        logo: 'https://via.placeholder.com/64?text=ZCC',
        website: 'https://zcc.com',
      },
      {
        id: 2,
        name: 'ArsenalRecruiters',
        description: 'A powerful organization about blah blah blah',
        members: 9051,
        userIsMember: false,
        logo: 'https://via.placeholder.com/64?text=Arsenal',
        website: 'https://arsenalrecruiters.com',
      },
    ];

    setOrganizations(mockOrganizations);
  }, []);

  const addOrganization = (org: Organization) => {
    setOrganizations((prevOrgs) => [...prevOrgs, org]);
  };

  return (
    <OrganizationContext.Provider value={{ organizations, setOrganizations, addOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Custom hook for using the context
export const useOrganizations = () => useContext(OrganizationContext);
