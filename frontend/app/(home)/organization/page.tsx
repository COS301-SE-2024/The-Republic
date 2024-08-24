'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Changed from 'next/router'
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
    // Implement the logic to add a new organization
    console.log('Add organization clicked');
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex justify-center w-full -mb-px">
          <li className="flex-1">
            <button
              className={`w-full p-4 text-center border-b-2 ${activeTab === 'All' ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabClick('All')}
              aria-current={activeTab === 'All' ? 'page' : undefined}
            >
              All Organizations
            </button>
          </li>
          <li className="flex-1">
            <button
              className={`w-full p-4 text-center border-b-2 ${activeTab === 'My' ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabClick('My')}
              aria-current={activeTab === 'My' ? 'page' : undefined}
            >
              My Organizations
            </button>
          </li>
        </ul>
      </div>
      <div className="p-5">
        <Organizations 
          onOrganizationClick={handleOrganizationClick} 
          filter={activeTab === 'My' ? 'userOnly' : 'all'}
        />
        <button 
          onClick={handleAddOrganization}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Organization
        </button>
      </div>
    </div>
  );
}

export default OrganizationPage;