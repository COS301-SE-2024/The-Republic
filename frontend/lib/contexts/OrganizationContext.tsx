"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Organization } from '../../lib/types';

interface OrganizationContextType {
  organizations: Organization[];
  addOrganization: (org: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]); // Empty initial state

  const addOrganization = (newOrg: Organization) => {
    setOrganizations(prevOrgs => [...prevOrgs, newOrg]);
  };

  return (
    <OrganizationContext.Provider value={{ organizations, addOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizations = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be used within an OrganizationProvider');
  }
  return context;
};
