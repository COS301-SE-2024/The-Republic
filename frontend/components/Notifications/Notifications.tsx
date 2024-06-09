import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ThumbsUp, MessageSquare, CheckCircle, Plus } from 'lucide-react';

type NotificationType = 'reaction' | 'comment' | 'resolve' | 'newIssue';

interface User {
  id: string;
  name: string;
}

interface Issue {
  id: string;
  title: string;
}

interface Notification {
  id: string;
  type: NotificationType;
  user: User;
  issue: Issue;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'reaction', user: { id: 'user1', name: 'John Doe' }, issue: { id: 'issue1', title: 'Pothole on Main Street' }, createdAt: '2023-06-09T10:00:00Z' },
  { id: '2', type: 'comment', user: { id: 'user2', name: 'Jane Smith' }, issue: { id: 'issue2', title: 'Streetlight out on Oak Avenue' }, createdAt: '2023-06-09T09:30:00Z' },
  { id: '3', type: 'resolve', user: { id: 'user3', name: 'City Worker' }, issue: { id: 'issue1', title: 'Pothole on Main Street' }, createdAt: '2023-06-09T08:00:00Z' },
  { id: '4', type: 'newIssue', user: { id: 'user4', name: 'Alice Johnson' }, issue: { id: 'issue3', title: 'Water pressure low in Westside' }, createdAt: '2023-06-08T15:00:00Z' },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'reaction': return <ThumbsUp className="h-5 w-5" />;
    case 'comment': return <MessageSquare className="h-5 w-5" />;
    case 'resolve': return <CheckCircle className="h-5 w-5" />;
    case 'newIssue': return <Plus className="h-5 w-5" />;
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
          {mockNotifications.map((notification) => (
            <li key={notification.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <p className="text-sm font-medium">{notification.user.name} {notification.type === 'newIssue' ? 'reported' : notification.type} "{notification.issue.title}"</p>
                <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;