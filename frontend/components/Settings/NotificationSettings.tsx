import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Filter } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; 

interface Preferences {
  comments: boolean;
  likes: boolean;
  newIssues: boolean;
}

interface Filters {
  municipality: boolean;
  subscriptions: boolean;
}

const NotificationSettings: React.FC = () => {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>({
    comments: true,
    likes: true,
    newIssues: true,
  });
  const [filters, setFilters] = useState<Filters>({
    municipality: true,
    subscriptions: true,
  });

  const toggleNotifications = () => {
    setNotificationsOn(!notificationsOn);
  };

  const handlePreferenceChange = (key: keyof Preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleFilterChange = (key: keyof Filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2" /> Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch id="notifications" checked={notificationsOn} onCheckedChange={toggleNotifications} />
          <Label htmlFor="notifications">Enable Notifications</Label>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Notification Preferences</h4>
          <div className="space-y-2">
            {(Object.keys(preferences) as Array<keyof Preferences>).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={key} checked={preferences[key]} onCheckedChange={() => handlePreferenceChange(key)} />
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Notification Filters
          </h4>
          <div className="space-y-2">
            {(Object.keys(filters) as Array<keyof Filters>).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={key} checked={filters[key]} onCheckedChange={() => handleFilterChange(key)} />
                <Label htmlFor={key}>From {key}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;