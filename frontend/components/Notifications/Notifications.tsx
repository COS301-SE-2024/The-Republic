import React from 'react';
import { Bell } from 'lucide-react';
import NotificationsList from './NotificationsList';

const Notifications: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>
      <NotificationsList />
    </div>
  );
};

export default Notifications;