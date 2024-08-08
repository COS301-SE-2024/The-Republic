'use client';
import { useState } from 'react';
import Visualizations from '@/components/Visualisations/Visualizations';
import Reports from '@/components/ReportCharts/Reports';

function Tabs() {
  const [activeTab, setActiveTab] = useState('Reports');
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex justify-center w-full -mb-px">
          <li className="flex-1">
            <a
              href="#"
              className={`block p-4 text-center border-b-2 ${activeTab === 'Reports' ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabClick('Reports')}
              aria-current={activeTab === 'Reports' ? 'page' : undefined}
            >
              Reports
            </a>
          </li>
          <li className="flex-1">
            <a
              href="#"
              className={`block p-4 text-center border-b-2 ${activeTab === 'Visualizations' ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabClick('Visualizations')}
            >
              Visualizations
            </a>
          </li>
        </ul>
      </div>
      <div className='p-5'>
        {activeTab === 'Reports' && <Reports selectedCharts={selectedCharts} setSelectedCharts={setSelectedCharts} />}
        {activeTab === 'Visualizations' && <Visualizations />}
      </div>
    </div>
  );
}

export default Tabs;
