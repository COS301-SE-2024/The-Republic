import React, { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import RequestVerifications from "./RequestVerification";
import NotificationSettings from "./NotificationSettings";
import AccountManagement from "./AccountManagement";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { signOutWithToast } from "@/lib/utils";

interface SettingsDropdownProps {
  title: string;
  children: React.ReactNode;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown mb-4">
      <button className="dropdown-trigger w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded" onClick={toggleDropdown}>
        {title}
      </button>
      {isOpen && <div className="dropdown-content mt-2">{children}</div>}
    </div>
  );
};

const SettingsPage = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto my-8 space-y-8 px-4">
      <div className="flex flex-col sm:flex-row mb-6 items-center">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0 sm:mr-auto">Account Settings</h1>
        <Button variant="outline" onClick={() => signOutWithToast(toast)}>
          Sign out
        </Button>
      </div>
      <SettingsDropdown title="Profile Settings">
        <ProfileSettings />
      </SettingsDropdown>
      <SettingsDropdown title="Request Verifications">
        <RequestVerifications />
      </SettingsDropdown>
      <SettingsDropdown title="Notification Settings">
        <NotificationSettings />
      </SettingsDropdown>
      <SettingsDropdown title="Account Management">
        <AccountManagement />
      </SettingsDropdown>
    </div>
  );
};

export default SettingsPage;