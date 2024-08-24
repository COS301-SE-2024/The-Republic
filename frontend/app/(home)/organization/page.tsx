'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Organizations from '@/components/Organization/Organization';

type Tab = 'All' | 'My';

function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const router = useRouter();

  useEffect(() => {
    const savedTab = sessionStorage.getItem('organizationTab') as Tab | null;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabClick = (tab: Tab) => {
    sessionStorage.setItem('organizationTab', tab);
    setActiveTab(tab);
  };

  const handleOrganizationClick = (id: number) => {
    router.push(`/organization/${id}`);
  };

  const handleAddOrganization = () => {
    console.log('Add organization clicked');
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-4">
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === 'All'
              ? 'text-green-600 border-b-2 border-green-600 dark:text-green-500 dark:border-green-500'
              : 'text-gray-500 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => handleTabClick('All')}
        >
          All Organizations
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === 'My'
              ? 'text-green-600 border-b-2 border-green-600 dark:text-green-500 dark:border-green-500'
              : 'text-gray-500 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => handleTabClick('My')}
        >
          My Organizations
        </button>
      </div>
      <Organizations 
        onOrganizationClick={handleOrganizationClick} 
        filter={activeTab === 'My' ? 'userOnly' : 'all'}
      />
      {activeTab === 'My' && (
        <button 
          onClick={handleAddOrganization}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Add Organization
        </button>
      )}
    </div>
  );
}

export default OrganizationPage;