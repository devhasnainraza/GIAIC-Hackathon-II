import { RecurringTaskList } from '@/components/recurring-tasks/RecurringTaskList';

export const metadata = {
  title: 'Recurring Tasks | Pure Tasks',
  description: 'Manage your recurring tasks',
};

export default function RecurringTasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <RecurringTaskList />
    </div>
  );
}
