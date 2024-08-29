import React, { useState } from 'react';
import { Organization, AnalyticsData, Member } from '../../lib/types';
import BarChart from '../ReportCharts/BarChart/BarChart'; 
import { FaEllipsisH } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Link from 'next/link';

const OrganizationDetail: React.FC<{ 
  organization: Organization; 
  analytics: AnalyticsData[]; 
  isAdmin?: boolean 
}> = ({ organization, analytics, isAdmin = true }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  console.log("isAdmin:", isAdmin); // Debugging isAdmin
  console.log("showMenu:", showMenu); // Debugging showMenu

  // Calculate total issues resolved and interactions
  const totalIssuesResolved = analytics.reduce((sum, data) => sum + data.issuesResolved, 0);
  const totalInteractions = analytics.reduce((sum, data) => sum + data.interactions, 0);

  return (
    <div className="p-5 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
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
        <div className="relative">
          <FaEllipsisH
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              setShowMenu(!showMenu);
              console.log("showMenu toggled to:", !showMenu); // Debugging toggle
            }}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              {isAdmin && (
                <Link href={`/organization/${organization.id}/admin`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Manage Organization
              </Link>
              
              )}
              {/* Add other menu items here */}
            </div>
          )}
        </div>
      </div>
      
      {/* About Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700 mb-2">{organization.description}</p>
      </div>

      {/* Members Summary and Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Dialog.Root open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <Dialog.Trigger asChild>
            <div className="bg-white p-4 rounded-lg shadow cursor-pointer">
              <h3 className="text-sm text-gray-500 mb-1">Total Members</h3>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold">{organization.memberCount}</span>
              </div>
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-auto">
              <Dialog.Title className="text-xl font-bold mb-4">Members List</Dialog.Title>
              <ul className="list-none mb-4">
                {organization.members.map((member: Member) => (
                  <li key={member.id} className="text-gray-700 mb-2">
                    {member.name} {member.isAdmin ? '(Admin)' : ''}
                  </li>
                ))}
              </ul>
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <AnalyticsCard title="Issues Resolved" value={totalIssuesResolved} />
        <AnalyticsCard title="Interactions" value={totalInteractions} />
      </div>

      {/* Analytics Charts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Issues Resolved vs Unresolved</h2>
        <BarChart />
      </div>

      {/* Join Request Button (for private organizations) */}
      {organization.isPrivate && !organization.userIsMember && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => {/* Handle join request */}}
        >
          Request to Join
        </button>
      )}
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
