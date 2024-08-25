'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Member {
  id: number;
  name: string;
  role: string;
}

interface Analytics {
  totalMembers: number;
  activeProjects: number;
  completedTasks: number;
}

interface Organization {
  id: number;
  name: string;
  description: string;
  members: Member[];
  analytics: Analytics;
}

export default function OrganizationDetail() {
  const [activeTab, setActiveTab] = useState('members');
  const [organization, setOrganization] = useState<Organization | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      // Fetch organization details based on id
      // This is a mock API call. Replace with your actual API call.
      const fetchOrganization = async () => {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockOrganization: Organization = {
          id: Number(id),
          name: `Organization ${id}`,
          description: `Detailed description of Organization ${id}`,
          members: [
            { id: 1, name: 'John Doe', role: 'Admin' },
            { id: 2, name: 'Jane Smith', role: 'Member' },
          ],
          analytics: {
            totalMembers: 10,
            activeProjects: 5,
            completedTasks: 50,
          },
        };
        setOrganization(mockOrganization);
      };

      fetchOrganization();
    }
  }, [id]);

  if (!organization) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">{organization.name}</h1>
      <p className="mb-4">{organization.description}</p>

      <div className="mb-4">
        <button 
          className={`mr-2 px-4 py-2 ${activeTab === 'members' ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'members' && (
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {organization.members.map((member) => (
              <tr key={member.id} className="border-t border-gray-200">
                <td className="p-3 text-sm text-gray-700">{member.name}</td>
                <td className="p-3 text-sm text-gray-700">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Organization Analytics</h2>
          <p>Total Members: {organization.analytics.totalMembers}</p>
          <p>Active Projects: {organization.analytics.activeProjects}</p>
          <p>Completed Tasks: {organization.analytics.completedTasks}</p>
        </div>
      )}
    </div>
  );
}