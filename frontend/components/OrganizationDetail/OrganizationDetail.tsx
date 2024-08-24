import React, { useState } from 'react';
import { useRouter } from 'next/router';


interface RouterQuery {
    id?: string | string[];
  }

const OrganizationDetail = () => {
  const [activeTab, setActiveTab] = useState('members');
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  // Fetch organization details based on id
  const organization = {
    id: 1,
    name: 'Organization 1',
    description: 'Detailed description of Organization 1',
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

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">{organization.name}</h1>
      <p className="mb-4">{organization.description}</p>

      <div className="mb-4">
        <button 
          className={`mr-2 px-4 py-2 ${activeTab === 'members' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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
};

export default OrganizationDetail;