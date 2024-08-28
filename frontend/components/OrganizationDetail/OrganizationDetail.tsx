import React, { useState } from 'react';
import { Organization, AnalyticsData } from '../../lib/types';
import BarChart from '../ReportCharts/BarChart/BarChart'; 
import { FaEllipsisV } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

const OrganizationDetail: React.FC<{ organization: Organization; analytics: AnalyticsData[] }> = ({ organization, analytics }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Calculate total issues resolved and interactions
  const totalIssuesResolved = analytics.reduce((sum, data) => sum + data.issuesResolved, 0);
  const totalInteractions = analytics.reduce((sum, data) => sum + data.interactions, 0);

  return (
    <div className="p-5 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {/* Logo rendering */}
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={`${organization.name} logo`}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Logo</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            {organization.website ? (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 flex items-center mt-2"
              >
                {organization.website}
              </a>
            ) : (
              <p className="text-gray-500 mt-2">No website provided</p>
            )}
          </div>
        </div>
        <FaEllipsisV className="text-gray-500 cursor-pointer" />
      </div>
      
      {/* About Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700 mb-2">{organization.description}</p>
      </div>

      {/* Members Summary and Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AnalyticsCard title="Issues Resolved" value={totalIssuesResolved} />
        <Dialog.Root open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <Dialog.Trigger asChild>
            <div className="bg-white p-4 rounded-lg shadow cursor-pointer">
              <h3 className="text-sm text-gray-500 mb-1">Total Members</h3>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold">{organization.members}</span>
              </div>
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-auto">
              <Dialog.Title className="text-xl font-bold mb-4">Members List</Dialog.Title>
              <ul className="list-none mb-4">
                {/* Display list of members if available */}
                <li className="text-gray-700 mb-2">Member List is not provided in the mock data</li>
              </ul>
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <AnalyticsCard title="Interactions" value={totalInteractions} />
      </div>

      {/* Analytics Charts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Issues Resolved vs Unresolved</h2>
        <BarChart  />
      </div>
    </div>
  );
};

const AnalyticsCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
    <div className="flex justify-between items-baseline">
      <span className="text-2xl font-bold">{value}</span>
    </div>
  </div>
);

export default OrganizationDetail;
