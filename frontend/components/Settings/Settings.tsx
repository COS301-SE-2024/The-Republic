import React, { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import NotificationSettings from "./NotificationSettings";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { signOutWithToast } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import AccountManagement from "./AccountManagement";

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
  const { user } = useUser();

  return (
    <div className="container mx-auto my-8 space-y-8">
      <div className="flex flex-row mb-6">
        <h1 className="text-3xl font-bold mr-auto">Account Settings</h1>
        <Button variant="outline" onClick={() => signOutWithToast(toast)}>
          Sign out
        </Button>
      </div>
      <SettingsDropdown title="Profile Settings">
        {user ? (
          <ProfileSettings currentUsername={user.username} />
        ) : (
          <p>User data not available</p>
        )}
      </SettingsDropdown>
      <SettingsDropdown title="Notification Settings">
        <NotificationSettings />
      </SettingsDropdown>

      <SettingsDropdown title="Account Management">
        <AccountManagement user={user}/>
      </SettingsDropdown>
    </div>
  );
};

export default SettingsPage;