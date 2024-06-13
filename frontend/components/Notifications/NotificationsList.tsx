// components/Notifications/NotificationsList.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, CheckCircle, Plus } from 'lucide-react';

export type NotificationType = 'reaction' | 'comment' | 'resolve' | 'newIssue';

export interface User {
  id: string;
  name: string;
}

export interface Issue {
  id: string;
  title: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  user: User;
  issue: Issue;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'newIssue',
    user: { id: 'user1', name: 'Thabo Mbeki' },
    issue: { id: 'issue1', title: 'Pothole on Nelson Mandela Drive, Pretoria' },
    createdAt: '2024-06-09T08:00:00Z',
  },
  {
    id: '2',
    type: 'comment',
    user: { id: 'user2', name: 'Nkosazana Dlamini-Zuma' },
    issue: { id: 'issue2', title: 'Streetlight out on Desmond Tutu Street, Cape Town' },
    createdAt: '2024-06-09T07:30:00Z',
  },
  {
    id: '3',
    type: 'resolve',
    user: { id: 'user3', name: 'Johannesburg City Worker' },
    issue: { id: 'issue1', title: 'Pothole on Nelson Mandela Drive, Pretoria' },
    createdAt: '2024-06-09T06:00:00Z',
  },
  {
    id: '4',
    type: 'newIssue',
    user: { id: 'user4', name: 'Charlize Theron' },
    issue: { id: 'issue3', title: 'Load shedding in Soweto, Johannesburg' },
    createdAt: '2024-06-08T13:00:00Z',
  },
  {
    id: '5',
    type: 'reaction',
    user: { id: 'user5', name: 'Siya Kolisi' },
    issue: { id: 'issue4', title: 'Rugby field maintenance needed in East London' },
    createdAt: '2024-06-08T10:00:00Z',
  },
  {
    id: '6',
    type: 'newIssue',
    user: { id: 'user6', name: 'Caster Semenya' },
    issue: { id: 'issue5', title: 'Athletics track renovation required in Polokwane' },
    createdAt: '2024-06-07T18:00:00Z',
  },
  {
    id: '7',
    type: 'comment',
    user: { id: 'user7', name: 'Trevor Noah' },
    issue: { id: 'issue6', title: 'Need more recycling bins in Durban beachfront' },
    createdAt: '2024-06-07T15:30:00Z',
  },
  {
    id: '8',
    type: 'resolve',
    user: { id: 'user8', name: 'Cape Town Water Management' },
    issue: { id: 'issue7', title: 'Water conservation plan for drought in Western Cape' },
    createdAt: '2024-06-07T12:00:00Z',
  },
  {
    id: '9',
    type: 'newIssue',
    user: { id: 'user9', name: 'Rolene Strauss' },
    issue: { id: 'issue8', title: 'Clinic renovation needed in Bloemfontein' },
    createdAt: '2024-06-06T09:00:00Z',
  },
  {
    id: '10',
    type: 'reaction', 
    user: { id: 'user10', name: 'Patrice Motsepe' },
    issue: { id: 'issue9', title: 'Solar panel installation for schools in Limpopo' },
    createdAt: '2024-06-05T14:00:00Z',
  },
];

const getNotificationIcon = (type: NotificationType): JSX.Element => {
  switch (type) {
    case 'reaction': return <ThumbsUp className="h-5 w-5" />;
    case 'comment': return <MessageSquare className="h-5 w-5" />;
    case 'resolve': return <CheckCircle className="h-5 w-5" />;
    case 'newIssue': return <Plus className="h-5 w-5" />;
  }
};

const formatRelativeTime = (dateString: string): string => {
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

const NotificationsList: React.FC = () => {
  return (
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
  );
};

export default NotificationsList;