import React, { useState, useEffect } from "react";
import ProfileSettings from "./ProfileSettings";
import RequestVerifications from "./RequestVerification";
import NotificationSettings from "./NotificationSettings";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { signOutWithToast } from "@/lib/utils";
import { fetchUserData } from "@/lib/api/fetchUserData"; // Adjust the import path as needed
import { UserAlt } from "@/lib/types";

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
  const [user, setUser] = useState<UserAlt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <SettingsDropdown title="Request Verifications">
        <RequestVerifications />
      </SettingsDropdown>
      <SettingsDropdown title="Notification Settings">
        <NotificationSettings />
      </SettingsDropdown>
    </div>
  );
};

export default SettingsPage;