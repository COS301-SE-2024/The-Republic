import React, { useState } from 'react';
import { Organization } from '@/lib/types';
import { useOrganizations } from '@/lib/contexts/OrganizationProvider';
import EditOrganizationForm from '../EditOrganizationForm/EditOrganizationForm';
import MemberManagement from '../MemberManagement/MemberManagment';
import OrganizationSettings from '../OrganizationSettings/OrganizationSettings';
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation';
import { useRouter } from 'next/navigation';

interface AdminDashboardProps {
  organization: Organization;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ organization }) => {
    const [activeTab, setActiveTab] = useState('edit');
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { setOrganizations } = useOrganizations();
    const router = useRouter();
  
    const handleSave = (updatedOrg: Organization) => {
      setOrganizations(prevOrgs => prevOrgs.map(org =>
        org.id === updatedOrg.id ? updatedOrg : org
      ));
      setShowEditForm(false);
    };

    const handleDelete = () => {
        setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== organization.id));
        setShowDeleteConfirmation(false);
        // Redirect to the organization list page
        router.push('/organization');
      };

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      
      <div className="flex mb-4">
        <button
          className={`mr-4 ${activeTab === 'edit' ? 'font-bold' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit Organization
        </button>
        <button
          className={`mr-4 ${activeTab === 'members' ? 'font-bold' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Manage Members
        </button>
        <button
          className={`mr-4 ${activeTab === 'settings' ? 'font-bold' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`mr-4 text-red-600`}
          onClick={() => setShowDeleteConfirmation(true)}
        >
          Delete Organization
        </button>
      </div>

      {activeTab === 'edit' && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowEditForm(true)}
        >
          Edit Organization Details
        </button>
      )}
      {activeTab === 'members' && <MemberManagement organization={organization} />}
      {activeTab === 'settings' && <OrganizationSettings organization={organization} />}

      {showEditForm && (
        <EditOrganizationForm
          organization={organization}
          onClose={() => setShowEditForm(false)}
          onSave={handleSave}
        />
      )}

{showDeleteConfirmation && (
        <DeleteConfirmation
          organizationName={organization.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;