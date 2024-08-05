"use client";

import React, { useState } from "react";
import { CircleHelp, Search, Book, Lightbulb, FileText } from "lucide-react";
import { useTheme } from "next-themes";

const GettingStarted = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Getting Started</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to navigate the dashboard</summary>
          <p className="mt-2">
            The dashboard is divided into several main sections:
            <br /><br />
            <ul className="list-disc ml-6 mt-2">
              <li><strong>Home:</strong> Overview of recent activities and issues.</li>
              <li><strong>Analytics:</strong> See data visualizations as well as charts of issues across the country.</li>
              <li><strong>Leaderboard:</strong> Check the top contributors based on the point system.</li>
              <li><strong>Profile:</strong> Manage your account and view your contributions.</li>
              <li><strong>Notifications:</strong> Stay updated on your reported issues and activity.</li>
            </ul>
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to report an issue</summary>
          <p className="mt-2">
            1. Click on the "Post Issue" button in the navigation menu.<br />
            2. Fill in the required details about the issue (e.g., type, location, description).<br />
            3. Add images if available (optional but recommended).<br />
            4. Submit the issue.<br />
            5. You'll earn points for contributing to the community!
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const KeyConcepts = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Key Concepts</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">What are issues?</summary>
          <p className="mt-2">
            Issues are problems or concerns related to governmental services, such as potholes, electricity outages, or other public infrastructure problems. Users can report these issues to bring attention to them and potentially get them resolved.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How does the point system work?</summary>
          <p className="mt-2">
            Our platform uses a point system to encourage positive contributions:
            <br /><br />
            <strong>Positive Actions:</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>Resolving an issue: +100 points (first time), +50 points (thereafter)</li>
              <li>Posting issues: +50 points (first time), +20 points (thereafter)</li>
              <li>Leaving a comment on an open issue: +10 points</li>
              <li>Reacting to an issue: +5 points</li>
            </ul>
            <br />
            <strong>Negative Actions:</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>Falsely resolving someone else's issue: -75 points</li>
              <li>Breaking community guidelines: -200 points</li>
            </ul>
            <br />
            Note: If your score falls below -150, your account may be blocked.
            The leaderboard displays your current ranking as well as the top 10 users.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Avoiding Penalties</summary>
          <p className="mt-2">
            To avoid penalties, ensure you accurately resolve issues. Falsely resolving an issue can result in penalties.
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const Guidelines = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Community Guidelines</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Reporting Issues</summary>
          <p className="mt-2">
            - Be accurate and honest when reporting issues.<br />
            - Provide clear descriptions and, if possible, include images.<br />
            - Avoid duplicate reports; check if the issue has already been reported.<br />
            - Respect privacy; don't share personal information of others.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Resolving Issues</summary>
          <p className="mt-2">
            - Only mark an issue as resolved if you're certain it has been fixed.<br />
            - Provide details on how the issue was resolved.<br />
            - If you're unsure who fixed it, use the "I don't know who fixed it" option.<br />
            - Be honest; falsely resolving issues will result in penalties.
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const HelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchResults = [
    { title: "How to report an issue", section: "getting-started" },
    { title: "Understanding the point system", section: "key-concepts" },
    { title: "Community guidelines", section: "guidelines" },
    { title: "Resolving issues", section: "guidelines" },
    { title: "Data visualization", section: "key-concepts" },
    { title: "Leaderboard", section: "key-concepts" },
  ].filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return <GettingStarted />;
      case "key-concepts":
        return <KeyConcepts />;
      case "guidelines":
        return <Guidelines />;
      default:
        return (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: <Book size={24} />, title: "Getting Started", key: "getting-started" },
              { icon: <Lightbulb size={24} />, title: "Key Concepts", key: "key-concepts" },
              { icon: <FileText size={24} />, title: "Guidelines", key: "guidelines" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center cursor-pointer"
                onClick={() => setActiveSection(item.key)}
              >
                <div className="bg-green-100 rounded-full p-3 mb-2">{item.icon}</div>
                <span className="text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        title="Toggle Help Menu"
      >
        <CircleHelp />
      </button>
      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 w-96 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-auto ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {activeSection !== "main" && (
            <button
              onClick={() => {
                setActiveSection("main");
                setSearchTerm("");
              }}
              className="mb-4 text-green-500"
            >
              &larr; Back to main menu
            </button>
          )}
          <h2 className="text-2xl mb-4 font-bold">Hello, How Can We Help You?</h2>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search your keyword here"
              className={`w-full p-2 pl-10 border rounded-full ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              }`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {searchTerm ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Search Results</h3>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="cursor-pointer text-green-500"
                    onClick={() => {
                      setActiveSection(result.section);
                      setSearchTerm(""); // Clear search term when navigating
                    }}
                  >
                    {result.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      )}
    </>
  );
};

export default HelpMenu;
