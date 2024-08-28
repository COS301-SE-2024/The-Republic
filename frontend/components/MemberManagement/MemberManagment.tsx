import React, { useState } from 'react';
import { Organization } from '@/lib/types';

interface MemberManagementProps {
  organization: Organization;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ organization }) => {
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', isAdmin: false },
    { id: 2, name: 'Jane Smith', isAdmin: true },
    // Add more mock members as needed
  ]);

  const toggleAdminStatus = (memberId: number) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId ? { ...member, isAdmin: !member.isAdmin } : member
      )
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Member Management</h3>
      <ul>
        {members.map(member => (
          <li key={member.id} className="flex items-center justify-between mb-2">
            <span>{member.name}</span>
            <button
              onClick={() => toggleAdminStatus(member.id)}
              className={`px-2 py-1 rounded ${
                member.isAdmin ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
            >
              {member.isAdmin ? 'Admin' : 'Member'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberManagement;