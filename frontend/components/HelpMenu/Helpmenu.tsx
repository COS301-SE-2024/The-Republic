import React, { useState, useEffect } from "react";
import { CircleHelp, Search, Book, Lightbulb, FileText, X, Home, BarChart2, UserCircle, Bell, MapPin, Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/lib/useMediaQuery";

const GettingStarted = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Getting Started</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to sign up</summary>
          <p className="mt-2">
            1. Fill in your details in the relevant fields.<br />
            2. Click "Signup" at the bottom of the screen.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to log in</summary>
          <p className="mt-2">
            1. Click on "login".<br />
            2. Fill in your details in the relevant fields.<br />
            3. Click "Login" at the bottom of the screen.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to navigate the dashboard</summary>
          <p className="mt-2">
            The dashboard is divided into several main sections:
            <ul className="list-disc ml-6 mt-2">
              <li><strong>Home:</strong> Overview of recent activities and issues.</li>
              <li><strong>Analytics:</strong> See data visualizations and charts of issues across the country.</li>
              <li><strong>Reports:</strong> View and manage your reported issues.</li>
              <li><strong>Notifications:</strong> Stay updated on your reported issues and activity.</li>
              <li><strong>Profile:</strong> Manage your account and view your contributions.</li>
              <li><strong>Settings:</strong> Adjust your account settings.</li>
              <li><strong>Leaderboard:</strong> Check the top contributors based on the point system.</li>
            </ul>
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
          <summary className="cursor-pointer font-semibold">How to report an issue</summary>
          <p className="mt-2">
            1. Write your issue in the input box on the homepage.<br />
            2. Select a category for your issue.<br />
            3. Select a mood for your issue.<br />
            4. Pick your location.<br />
            5. Optionally include an image.<br />
            6. Choose to be anonymous or not by clicking the checkbox.<br />
            7. Click "Post" to submit your issue.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to make a comment</summary>
          <p className="mt-2">
            1. Click on the chatbox icon on a specific issue.<br />
            2. Type your comment in the input box.<br />
            3. Click "Send" to post your comment.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Subscription and filtering</summary>
          <p className="mt-2">
            - To subscribe: Click the green bell icon and choose what to subscribe to (specific issue, category, or location).<br />
            - To filter: Use the sort and filter options on the right-hand sidebar to organize issues by newest, oldest, most comments, subscriptions, categories, or location.
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const ProfileManagement = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Profile Management</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">How to edit your profile</summary>
          <p className="mt-2">
            1. Navigate to your profile page.<br />
            2. Click on "Edit Profile".<br />
            3. Add or modify the relevant information.<br />
            4. Click "Save" to apply the changes.
          </p>
        </details>
      </li>
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Setting your location</summary>
          <p className="mt-2">
            1. Go to your profile page.<br />
            2. Click on "Edit Profile".<br />
            3. Click on "Update Location".<br />
            4. Choose to use a pin location or manually type your location.
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const AnalyticsGuide = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Analytics</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Using the Analytics page</summary>
          <p className="mt-2">
            The Analytics page has two tabs:<br />
            - Reports tab: View different reporting charts<br />
            - Visualization tab: Explore an interactive diagram<br /><br />
            To use:<br />
            1. Filter reporting charts using the "filter charts" button.<br />
            2. Navigate to the Visualization tab for the explorative diagram.<br />
            3. Click on different circles in the diagram for more information.
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const LeaderboardGuide = () => (
  <div>
    <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
    <ul className="space-y-2">
      <li>
        <details>
          <summary className="cursor-pointer font-semibold">Understanding the Leaderboard</summary>
          <p className="mt-2">
            The Leaderboard showcases the point system of the web app. It displays:<br />
            - Your ranking and points<br />
            - Ranking and points of the top 10 users<br /><br />
            To filter the rankings:<br />
            1. Set your location in your profile.<br />
            2. Click on "filter" in the Leaderboard.<br />
            3. Choose to filter by country, province, city, or suburb ranking.
          </p>
        </details>
      </li>
    </ul>
  </div>
);

const ExpandedHelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchResults = [
    { title: "How to sign up", section: "getting-started" },
    { title: "How to log in", section: "getting-started" },
    { title: "Navigating the dashboard", section: "getting-started" },
    { title: "Reporting an issue", section: "key-concepts" },
    { title: "Making a comment", section: "key-concepts" },
    { title: "Subscription and filtering", section: "key-concepts" },
    { title: "Editing your profile", section: "profile-management" },
    { title: "Setting your location", section: "profile-management" },
    { title: "Using the Analytics page", section: "analytics" },
    { title: "Understanding the Leaderboard", section: "leaderboard" },
  ].filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return <GettingStarted />;
      case "key-concepts":
        return <KeyConcepts />;
      case "profile-management":
        return <ProfileManagement />;
      case "analytics":
        return <AnalyticsGuide />;
      case "leaderboard":
        return <LeaderboardGuide />;
      default:
        return (
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-6`}>
            {[
              { icon: <Book size={isMobile ? 20 : 24} />, title: "Getting Started", key: "getting-started" },
              { icon: <Lightbulb size={isMobile ? 20 : 24} />, title: "Key Concepts", key: "key-concepts" },
              { icon: <UserCircle size={isMobile ? 20 : 24} />, title: "Profile Management", key: "profile-management" },
              { icon: <BarChart2 size={isMobile ? 20 : 24} />, title: "Analytics", key: "analytics" },
              { icon: <Trophy size={isMobile ? 20 : 24} />, title: "Leaderboard", key: "leaderboard" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center cursor-pointer"
                onClick={() => setActiveSection(item.key)}
              >
                <div className="bg-green-100 dark:bg-green-600 rounded-full p-3 mb-2">{item.icon}</div>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{item.title}</span>
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
        className={`fixed ${isMobile ? 'bottom-2 left-2' : 'bottom-4 right-4'} bg-green-500 text-white rounded-full ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center shadow-lg z-50`}
        title="Toggle Help Menu"
      >
        <CircleHelp size={isMobile ? 20 : 24} />
      </button>
      {isOpen && (
        <div
          className={`fixed ${isMobile ? 'inset-2' : 'bottom-20 right-4 w-96'} p-4 sm:p-6 rounded-lg shadow-lg ${isMobile ? 'max-h-[90vh]' : 'max-h-[80vh]'} overflow-auto ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } z-50`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          {activeSection !== "main" && (
            <button
              onClick={() => {
                setActiveSection("main");
                setSearchTerm("");
              }}
              className="mb-4 text-green-500 text-sm"
            >
              &larr; Back to main menu
            </button>
          )}
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} mb-4 font-bold mt-6`}>Hello, How Can We Help You?</h2>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search your keyword here"
              className={`w-full p-2 pl-10 border rounded-full ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              } ${isMobile ? 'text-sm' : ''}`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={isMobile ? 16 : 20} />
          </div>

          {searchTerm ? (
            <div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>Search Results</h3>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer text-green-500 ${isMobile ? 'text-sm' : ''}`}
                    onClick={() => {
                      setActiveSection(result.section);
                      setSearchTerm("");
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

export default ExpandedHelpMenu;