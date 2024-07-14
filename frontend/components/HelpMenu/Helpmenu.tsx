"use client";

import React, { useState } from "react";
import { CircleHelp } from "lucide-react";
import { useTheme } from "next-themes";

const HelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
<<<<<<< HEAD
      <button onClick={toggleMenu} className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg" title="Toggle Help Menu">
=======
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
>>>>>>> 3399dee0e5bc67293f9f83c4348d6fbd597ba7c3
        <CircleHelp />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleMenu}
        >
          <div
            className={`p-6 rounded-lg shadow-lg w-11/12 max-w-2xl max-h-3/4 overflow-y-auto ${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl mb-4">Help Menu</h2>
            <input
              type="text"
              placeholder="Search..."
              className={`w-full p-2 mb-4 border rounded ${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800"}`}
            />

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl">Getting Started</h3>
                <details>
                  <summary className="cursor-pointer">
                    How to navigate the dashboard
                  </summary>
                  <p className="mt-2">
                    <strong>General Section:</strong>
                    <br />
                    The General section consists of:
                    <ul className="list-disc ml-6 mt-2">
                      <li>
                        <strong>Visualization:</strong> A visualization of the
                        aggregated data of issues.
                      </li>
                      <li>
                        <strong>Reports:</strong> View statistical charts of
                        data.
                      </li>
                      <li>
                        <strong>Notifications:</strong> View your notifications.
                      </li>
                    </ul>
                  </p>
                  <p className="mt-2">
                    <strong>Account Section:</strong>
                    <br />
                    The Account section consists of:
                    <ul className="list-disc ml-6 mt-2">
                      <li>
                        <strong>Profile:</strong> This is where your profile
                        page is located
                      </li>
                      <li>
                        <strong>Settings:</strong> Account settings can be
                        managed here
                      </li>
                      <li>
                        <strong>Logout:</strong> Log out of your account.
                      </li>
                    </ul>
                  </p>
                </details>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl">Creating and Managing Posts</h3>
                <details>
                  <summary className="cursor-pointer">
                    Creating your first post
                  </summary>
                  <p className="mt-2">
                    Write in the input box on the homepage and press Post once
                    done.
                  </p>
                </details>
                <details>
                  <summary className="cursor-pointer">
                    Updating your profile
                  </summary>
                  <p className="mt-2">
                    On the left side bar, navigate to Profile and click on Edit
                    Profile.
                  </p>
                </details>
                <details>
                  <summary className="cursor-pointer">
                    Editing privacy settings
                  </summary>
                  <p className="mt-2">
                    On the left side bar, navigate to Settings and click on
                    Profile Settings.
                  </p>
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
