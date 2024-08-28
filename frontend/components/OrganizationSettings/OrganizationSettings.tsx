import React, { useState } from 'react';
import { Organization } from '@/lib/types';

interface OrganizationSettingsProps {
  organization: Organization;
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ organization }) => {
  const [joinPolicy, setJoinPolicy] = useState('open');

  const handleJoinPolicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJoinPolicy(e.target.value);
    // Here you would typically update the organization's settings in your backend
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Organization Settings</h3>
      <div className="mb-4">
        <label htmlFor="joinPolicy" className="block mb-2">Join Policy:</label>
        <select
          id="joinPolicy"
          value={joinPolicy}
          onChange={handleJoinPolicyChange}
          className="w-full p-2 border rounded"
        >
          <option value="open">Open (Anyone can join)</option>
          <option value="approval">Approval Required</option>
          <option value="closed">Closed (Invite only)</option>
        </select>
      </div>
      {/* Add more organization-wide settings here */}
    </div>
  );
};

export default OrganizationSettings;