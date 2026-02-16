import { ReminderSettings } from '@/components/reminders/ReminderSettings';
import { UpcomingReminders } from '@/components/reminders/UpcomingReminders';

export const metadata = {
  title: 'Reminders | Pure Tasks',
  description: 'Manage your task reminders and notification preferences',
};

export default function RemindersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Upcoming Reminders Section */}
        <UpcomingReminders />

        {/* Reminder Settings Section */}
        <div className="border-t border-gray-200 pt-8">
          <ReminderSettings />
        </div>
      </div>
    </div>
  );
}
