import React, { useState } from 'react';
import { Organization, Member, JoinRequest } from '../../lib/types';
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import { PiCirclesFourLight } from 'react-icons/pi';
import { FaRegUser } from "react-icons/fa6";
import { VscMegaphone } from "react-icons/vsc";
import { LuPenLine } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { X } from 'lucide-react';
import Link from 'next/link'; // Import Link

const AdminDashboard: React.FC<{ organization: Organization }> = ({ organization }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');

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
    console.log(`Broadcast message: ${message}`);
  };

  return (
    <div className="bg-white p-14 min-h-screen">
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
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <span>{organization.name}</span>
              <button
                className="p-2 rounded-full text-gray-500"
                onClick={() => console.log("Edit clicked")} // Replace with actual handler
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
          className="px-5 py-2 bg-green-200 rounded-full text-sm"
        >
          Back
        </Link>
      </div>

      <p className="text-sm font-bold mb-3">About</p>
      <p className="text-sm font-light mb-6">{organization.description}</p>
      
      <div className="bg-gray-100 rounded-lg mb-6">
        <div className="flex justify-between items-center px-12 py-2 relative">
          <button
            className={`flex items-center px-3 py-2 mr-1 rounded-lg relative ${activeTab === 'members' ? 'bg-white ' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <PiCirclesFourLight className="w-6 h-6 text-gray-500" />
            Members
            {activeTab === 'members' && (
              <div className="absolute bottom-[-20px] left-0 w-full h-[25px] bg-white rounded-b-lg"></div>
            )}
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg relative ${activeTab === 'requests' ? 'bg-white shadow-md' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FaRegUser className="w-6 h-6 mr-2 text-gray-500" />
            Requests
            {activeTab === 'requests' && (
              <div className="absolute bottom-[-20px] left-0 w-full h-[25px] bg-white rounded-b-lg"></div>
            )}
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg relative ${activeTab === 'broadcast' ? 'bg-white shadow-md' : ''}`}
            onClick={() => setActiveTab('broadcast')}
          >
            <VscMegaphone className="w-6 h-6 mr-2 text-gray-500" />
            Broadcast
            {activeTab === 'broadcast' && (
              <div className="absolute bottom-[-20px] left-0 w-full h-[25px] bg-white rounded-b-lg"></div>
            )}
          </button>

          <button
            className="p-2 rounded-full bg-gray-100 text-black"
            onClick={() => console.log("Icon button clicked")} // Replace with your actual handler
          >
            <LiaFileDownloadSolid className="w-6 h-6" />
          </button>
        </div>
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
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {organization.members.map((member: Member) => (
                <tr key={member.id} className="border-b last:border-b-0">
                  <td className="py-3 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    {member.name}
                  </td>
                  <td className="py-3">{member.email}</td>
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
        </div>
      )}
      
      {activeTab === 'requests' && (
        <div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">Name</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {organization.joinRequests.map((request: JoinRequest) => (
                <tr key={request.id} className="border-b last:border-b-0">
                  <td className="py-3 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    {request.userName}
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
                      <TiTick size={25}/>
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
            className="w-full p-4 border rounded-lg mb-4 h-40 focus:outline-none focus:ring-0"
            placeholder="Write an announcement..."
          ></textarea>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-full"
            onClick={() => handleBroadcast("Sample message")}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
