'use client';
import { useEffect, useState } from 'react';
import Visualizations from '@/components/Visualisations/Visualizations';
import Reports from '@/components/ReportCharts/Reports';

function Tabs() {
  const [activeTab, setActiveTab] = useState("Reports");
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  useEffect(() => {
    const savedTab = sessionStorage.getItem("analyticsTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabClick = (tab: string) => {
    sessionStorage.setItem("analyticsTab", tab);
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex justify-center w-full -mb-px">
          <li className="flex-1">
            <button
              className={`w-full p-4 text-center border-b-2 ${activeTab === 'Reports' ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabClick('Reports')}
              aria-current={activeTab === 'Reports' ? 'page' : undefined}
            >
              Statistics
            </button>
          </li>
          <li className="flex-1">
            <button
              className={`w-full p-4 text-center border-b-2 ${activeTab === 'Visualizations' ? 'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabClick('Visualizations')}
            >
              Visualizations
            </button>
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
