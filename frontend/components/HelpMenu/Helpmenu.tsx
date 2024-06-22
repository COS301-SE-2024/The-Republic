"use client";

import React, { useState } from 'react';
import { CircleHelp } from "lucide-react";

const HelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleMenu} className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
        ?
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleMenu}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl max-h-3/4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl mb-4">Help Menu</h2>
            <input type="text" placeholder="Search..." className="w-full p-2 mb-4 border rounded" />

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl">Getting Started</h3>
                <details>
                  <summary>How to navigate the dashboard</summary>
                  <p className="mt-2">
                    <strong>General Section:</strong><br />
                    The left sidebar under the General section consists of:
                    <ul className="list-disc ml-6 mt-2">
                      <li><strong>Visualization:</strong> View aggregated data of issues.</li>
                      <li><strong>Reports:</strong> View statistical charts of data.</li>
                      <li><strong>Notifications:</strong> View your notifications.</li>
                    </ul>
                  </p>
                  <p className="mt-2">
                    <strong>Account Section:</strong><br />
                    The left sidebar under the Account section consists of:
                    <ul className="list-disc ml-6 mt-2">
                      <li><strong>Profile:</strong> Navigate to your profile page.</li>
                      <li><strong>Settings:</strong> Edit your settings.</li>
                      <li><strong>Logout:</strong> Log out of your account.</li>
                    </ul>
                  </p>
                  <p className="mt-2">
                    <strong>Right Sidebar:</strong><br />
                    Users can sort and filter the issues displayed to them.
                  </p>
                </details>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl">Creating and Managing Posts</h3>
                <details>
                  <summary>Creating your first post</summary>
                  <p className="mt-2">To create your first post, write in the input box and press Post once done.</p>
                </details>
                <details>
                  <summary>Updating your profile</summary>
                  <p className="mt-2">To update your profile, navigate to Profile and click on Edit Profile.</p>
                </details>
                <details>
                  <summary>Editing privacy settings</summary>
                  <p className="mt-2">To edit privacy settings, navigate to Settings and click on Profile Settings.</p>
                </details>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl">FAQs</h3>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl">Tutorials and Guides</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpMenu;
