import React from 'react';
import InfoIcon from '@/components/icons/InfoIcon';

interface PopoverProps {
  readonly message: string | null;
}

export default function InfoPopover({ message }: PopoverProps) {
  return (
    <div className="relative inline-block group">
      <button
        type="button"
        className="text-white bg-green-500 hover:bg-green-600 rounded-full text-sm p-2 text-center focus:outline-none inline-flex justify-center items-center"
        title="Resolution Information"
      >
        <InfoIcon />
      </button>
      <div
        role="tooltip"
        className="absolute hidden w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100 mt-2 right-0 dark:text-gray-100 dark:bg-popover dark:border-popover"
      >
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:bg-gray-900 dark:border-gray-900">
          <h3 className="font-semibold text-gray-900 dark:text-gray-200">Resolution Information</h3>
        </div>
        <div className="px-3 py-2">
          <p>{message ?? 'This issue may take at least 6 day(s) to be resolved. Please check back if your issue is not resolved by then.'}</p>
        </div>
        {/* <div className="absolute w-3 h-3 bg-white transform rotate-45 border-l border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800"></div> */}
      </div>
    </div>
  );
}