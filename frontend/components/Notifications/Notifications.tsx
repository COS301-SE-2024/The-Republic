import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ThumbsUp, MessageSquare } from 'lucide-react';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'resolved' | 'newIssue';
  message: string;
  timestamp: string;
}

const notifications: Notification[] = [
  { id: 1, type: 'like', message: 'John Doe liked your issue "Fix broken link"', timestamp: '5m ago' },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return <ThumbsUp className="h-5 w-5 text-blue-500" />;
    case 'comment':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'resolved':
  }
};

const NotificationsPage: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;