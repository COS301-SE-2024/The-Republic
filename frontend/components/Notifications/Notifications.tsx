import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ThumbsUp, MessageSquare, CheckCircle, User } from 'lucide-react';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'resolved' | 'newIssue';
  message: string;
  timestamp: string;
}

const notifications: Notification[] = [
  { id: 1, type: 'like', message: 'John Doe liked your issue "Fix broken link"', timestamp: '5m ago' },
  { id: 2, type: 'comment', message: 'Jane Smith commented on your issue "Update dependencies"', timestamp: '10m ago' },
  { id: 3, type: 'resolved', message: 'Your issue "Improve performance" has been marked as resolved', timestamp: '1h ago' },
  { id: 4, type: 'newIssue', message: 'Alex Johnson created a new issue "Add dark mode"', timestamp: '2h ago' },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return <ThumbsUp className="h-5 w-5" />;
    case 'comment':
      return <MessageSquare className="h-5 w-5" />;
    case 'resolved':
      return <CheckCircle className="h-5 w-5" />;
    case 'newIssue':
      return <User className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
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
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;