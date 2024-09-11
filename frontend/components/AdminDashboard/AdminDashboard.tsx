import React, { useState, useEffect } from 'react';
import { Organization, Member, JoinRequest } from '../../lib/types';
import { FaSearch } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import { PiCirclesFourLight } from 'react-icons/pi';
import { FaRegUser } from "react-icons/fa6";
import { VscMegaphone } from "react-icons/vsc";
import { LuPenLine } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import EditOrganizationForm from '../EditOrganizationForm/EditOrganizationForm';
import { checkContentAppropriateness } from '@/lib/api/checkContentAppropriateness'; 
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const AdminDashboard: React.FC<{ organization: Organization }> = ({ organization }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(organization.members);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orgData, setOrgData] = useState<Organization>(organization);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastError, setBroadcastError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const sanitizedTerm = searchTerm.replace(/[^\w\s]/gi, '');
    const results = organization.members.filter(member =>
      member.name.toLowerCase().includes(sanitizedTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(sanitizedTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, organization.members]);

  const handleAppointAdmin = (memberId: number) => {
    console.log(`Appoint admin: ${memberId}`);
  };

  const handleRemoveMember = (memberId: number) => {
    console.log(`Remove member: ${memberId}`);
  };

  const handleAcceptRequest = (requestId: number) => {
    console.log(`Accept request: ${requestId}`);
  };

  const handleRejectRequest = (requestId: number) => {
    console.log(`Reject request: ${requestId}`);
  };

  const handleBroadcast = (message: string) => {
    setBroadcastError(''); 
    const isAppropriate = checkContentAppropriateness(message);

    if (!isAppropriate) {
      setBroadcastError('Broadcast message contains inappropriate content. Please modify the message.');
      return;
    }

    console.log(`Broadcast message: ${message}`);
    setBroadcastMessage('');
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = (updatedOrganization: Organization) => {
    setOrgData(updatedOrganization); 
    closeEditModal(); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleDownloadReport = () => {
    console.log("Download Report clicked");
  };

  return (
    <div className={`p-14 min-h-screen ${theme === 'dark' ? 'bg-[#0C0A09]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
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
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <span>{organization.name}</span>
              <button 
                className="p-2 rounded-full text-gray-500"
                onClick={openEditModal} 
              >
                <LuPenLine className="w-5 h-5" />
              </button>
            </h1>
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

        <Link
          href={`/organization/${organization.id}`}
          className={`px-5 py-2 rounded-full text-sm ${theme === 'dark' ? 'bg-green-400 text-gray-900 font-bold' : 'bg-green-200 text-gray-900'}`}
          >
            Back
          </Link>
      </div>

      <p className="text-sm font-bold mb-3">About</p>
      <p className="text-sm font-light mb-6">{organization.description}</p>
      
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex items-center space-x-2 flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === 'members'
              ? 'text-green-600 border-b-2 border-green-600 dark:text-green-500 dark:border-green-500'
              : 'text-gray-500 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('members')}
        >
          <FaRegUser className="w-5 h-5" />
          <span>Members</span>
        </button>
        <button
          className={`flex items-center space-x-2 flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === 'requests'
              ? 'text-green-600 border-b-2 border-green-600 dark:text-green-500 dark:border-green-500'
              : 'text-gray-500 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          <PiCirclesFourLight className="w-5 h-5" />
          <span>Requests</span>
        </button>
        <button
          className={`flex items-center space-x-2 flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === 'broadcast'
              ? 'text-green-600 border-b-2 border-green-600 dark:text-green-500 dark:border-green-500'
              : 'text-gray-500 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('broadcast')}
        >
          <VscMegaphone className="w-5 h-5" />
          <span>Broadcast</span>
        </button>
        <button
          className="p-2 rounded-full text-black relative"
          onClick={toggleDropdown}
        >
          <LiaFileDownloadSolid className="w-6 h-6" />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={handleDownloadReport}
              >
                Download Report
              </button>
            </div>
          )}
        </button>
      </div>

      {activeTab === 'members' && (
        <div>
          <div className="flex items-center mb-4 border rounded-full">
            <FaSearch className="text-gray-400 ml-2 mr-1" />
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 rounded-lg border-transparent focus:outline-none focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredMembers.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-2">Member</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member: Member) => (
                  <tr key={member.id} className="border-b last:border-b-0">
                    <td className="py-3 flex items-center">
                      <Avatar className="w-10 h-10 rounded-full mr-3">
                        <AvatarImage src={member.imageUrl || undefined} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-gray-500">@{member.username}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      {member.isAdmin ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">Admin</span>
                      ) : (
                        <button
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm"
                          onClick={() => handleAppointAdmin(member.id)}
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-6">No users found</p>
          )}
        </div>
      )}
      
      {activeTab === 'requests' && (
        <div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">Request</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {organization.joinRequests.map((request: JoinRequest) => (
                <tr key={request.id} className="border-b last:border-b-0">
                  <td className="py-3 flex items-center">
                    <Avatar className="w-10 h-10 rounded-full mr-3">
                    <AvatarImage src={request.imageUrl || undefined} alt={request.name} />
                      <AvatarFallback>{request.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{request.name}</p>
                    <p className="text-sm text-gray-500">@{request.username}</p>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      className="text-red-500 mr-16"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <TbTrash size={20} />
                    </button>
                    <button
                      className="text-green-500 mr-10"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      <TiTick size={30} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'broadcast' && (
        <div>
          <textarea
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter broadcast message"
            rows={4}
            onChange={(e) => handleBroadcast(e.target.value)}
          ></textarea>
          <button className="mt-3 px-5 py-2 bg-green-500 text-white rounded-full">Send</button>
        </div>
      )}

{isEditModalOpen && (
  <EditOrganizationForm
    isOpen={isEditModalOpen}
    initialOrganization={orgData}
    onSave={handleSave}
    onClose={closeEditModal}
  />
)}
    </div>
  );
};

export default AdminDashboard;
