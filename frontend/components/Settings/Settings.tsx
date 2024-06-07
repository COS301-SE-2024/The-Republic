import React from 'react';
import ProfileSettings from './ProfileSettings';
import RequestVerifications from './RequestVerification';
import NotificationSettings from './NotificationSettings';

const SettingsPage = () => {
  return (
    <div className="container mx-auto my-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <ProfileSettings />
      <RequestVerifications />
      <NotificationSettings />
    </div>
  );
};

export default SettingsPage;