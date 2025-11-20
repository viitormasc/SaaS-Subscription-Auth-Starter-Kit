import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export default function NotificationsComponentTab() {
  const initialPermission =
    Notification.permission === 'granted' ? true : false;
  const [notificationsPermission, setNotificationsPermission] =
    useState(initialPermission);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Notification Settings
        </h2>
        <p className="text-muted-foreground">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
          <div className="space-y-0.5">
            <Label
              htmlFor="notifications"
              className="text-foreground font-medium"
            >
              Enable Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about your study progress and achievements
            </p>
          </div>
          <Switch
            id="notifications"
            checked={notificationsPermission}
            onCheckedChange={() => {
              alert(
                `Notifications are ${Notification.permission}. To change this, please go to your browser settings`,
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
          <div className="space-y-0.5">
            <Label className="text-foreground font-medium">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive weekly progress reports via email
            </p>
          </div>
          <Switch
            defaultChecked
            onCheckedChange={(checked) => {
              console.log('Email notifications:', checked);
            }}
          />
        </div>
      </div>
    </div>
  );
}
