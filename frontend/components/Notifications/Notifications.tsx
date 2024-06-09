import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, CheckCircle, Plus, Bell } from 'lucide-react';

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
  {
    id: '1',
    type: 'reaction',
    user: { id: 'user1', name: 'Thabo Mbeki' },
    issue: { id: 'issue1', title: 'Pothole on Nelson Mandela Drive' },
    createdAt: '2024-06-09T08:00:00Z',
  },
  {
    id: '2',
    type: 'comment',
    user: { id: 'user2', name: 'Nkosazana Dlamini-Zuma' },
    issue: { id: 'issue2', title: 'Streetlight out on Desmond Tutu Street' },
    createdAt: '2024-06-09T07:30:00Z',
  },
  {
    id: '3',
    type: 'resolve',
    user: { id: 'user3', name: 'Johannesburg City Worker' },
    issue: { id: 'issue1', title: 'Pothole on Nelson Mandela Drive' },
    createdAt: '2024-06-09T06:00:00Z',
  },
  {
    id: '4',
    type: 'newIssue',
    user: { id: 'user4', name: 'Charlize Theron' },
    issue: { id: 'issue3', title: 'Load shedding in Soweto' },
    createdAt: '2024-06-08T13:00:00Z',
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'reaction':
      return <ThumbsUp className="h-5 w-5" />;
    case 'comment':
      return <MessageSquare className="h-5 w-5" />;
    case 'resolve':
      return <CheckCircle className="h-5 w-5" />;
    case 'newIssue':
      return <Plus className="h-5 w-5" />;
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
  if (diffMins < 60) return rtf.format(-diffMins, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  return rtf.format(-diffDays, 'day');
};

const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {mockNotifications.map((notification) => (
              <li key={notification.id} className="flex items-start space-x-3 p-4 hover:bg-gray-50">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {notification.user.name}{' '}
                    {notification.type === 'newIssue'
                      ? 'reported'
                      : notification.type === 'reaction'
                      ? 'reacted to'
                      : notification.type}{' '}
                    "{notification.issue.title}"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;