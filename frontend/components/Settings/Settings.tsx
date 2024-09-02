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
  const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown">
      <button className="dropdown-trigger" onClick={toggleDropdown}>
        {title}
      </button>
      {isOpen && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

const SettingsPage = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto my-8 space-y-8">
      <div className="flex flex-row mb-6">
        <h1 className="text-3xl font-bold mr-auto">Account Settings</h1>
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
