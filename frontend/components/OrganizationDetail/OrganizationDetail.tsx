'use client';

import React, { useState } from 'react';
import { Organization, AnalyticsData, Member } from '../../lib/types';
import BarChart from '../ReportCharts/BarChart/BarChart';
import { FaEllipsisH } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useTheme } from 'next-themes'; 

const OrganizationDetail: React.FC<{ 
  organization: Organization; 
  analytics: AnalyticsData[];
  isAdmin: boolean; 
}> = ({ organization, analytics, isAdmin }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { theme } = useTheme(); 

  const isMember = organization.userIsMember;
  const canJoin = !isMember && organization.joinPolicy === 'open';
  const canRequestToJoin = !isMember && organization.joinPolicy === 'closed';
  const manageOrg = isMember && isAdmin;
  const leaveOrg = isMember && !isAdmin;

  // Calculate total issues resolved and interactions
  const totalIssuesResolved = analytics.reduce((sum, data) => sum + data.issuesResolved, 0);
  const totalInteractions = analytics.reduce((sum, data) => sum + data.interactions, 0);

  const handleJoinClick = () => {
    console.log('Join organization clicked');
  };

  const handleRequestClick = () => {
    console.log('Request to join organization clicked');
  };

  const handleLeaveClick = () => {
    console.log('Leave organization clicked');
    
  };

  return (
    <div className={`p-14 min-h-screen ${theme === 'dark' ? 'bg-[#0C0A09] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="relative mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {organization.logo ? (
              <Image
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
            <FaEllipsisH size={25}
              className={`cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
                {manageOrg && (
                  <Link href={`/organization/${organization.id}/admin`} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    Manage Organization
                  </Link>
                )}
                {leaveOrg && (
                  <button
                    onClick={handleLeaveClick}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Leave Organization
                  </button>
                )}
                {canJoin && (
                  <button
                    onClick={handleJoinClick}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Join Organization
                  </button>
                )}
                {canRequestToJoin && (
                  <button
                    onClick={handleRequestClick}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Request to Join
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="absolute top-[-20px] right-0">
          <Link
            href={`/organization`}
            className={`px-5 py-2 rounded-full text-sm ${theme === 'dark' ? 'bg-green-400 text-gray-900 font-bold' : 'bg-green-200 text-gray-900'}`}
          >
            Back
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="mb-2">{organization.description}</p>
      </div>

      {/* Members Summary and Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <div className={`p-4 rounded-lg shadow border cursor-pointer ${theme === 'dark' ? 'bg-[#0C0A09] text-gray-300' : 'bg-white text-gray-900'}`}>
              <h3 className="text-sm mb-1">Total Members</h3>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold">{organization.memberCount}</span>
              </div>
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 w-96 max-h-[80vh] overflow-auto rounded-lg shadow-lg border ${theme === 'dark' ? 'bg-[#0C0A09] text-gray-300' : 'bg-white text-gray-900'}`}>
            <Dialog.Title className="text-xl font-bold mb-4 border-b-2 border-gray-300 dark:border-gray-700">
  Members List
</Dialog.Title>

              <ul className="list-none mb-4">
                {organization.members.map((member: Member) => (
                  <li key={member.id} className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src={member.imageUrl || undefined} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm">@{member.username}</p>
                    </div>
                    {member.isAdmin && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>}
                  </li>
                ))}
              </ul>
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
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
      <div className={`p-4 rounded-lg shadow  cursor-pointer ${theme === 'dark' ? 'bg-[#0C0A09] text-gray-300' : 'bg-white text-gray-900'}`}>
        <h2 className="text-xl font-semibold mb-4">Issues Resolved vs Unresolved</h2>
        <BarChart />
      </div>
    </div>
  );
};

const AnalyticsCard: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  const { theme } = useTheme(); 

  return (
    <div className={`p-4 rounded-lg shadow border cursor-pointer ${theme === 'dark' ? 'bg-[#0C0A09] text-gray-300' : 'bg-white text-gray-900'}`}>
      <h3 className="text-sm mb-1">{title}</h3>
      <div className="flex justify-between items-baseline">
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default OrganizationDetail;