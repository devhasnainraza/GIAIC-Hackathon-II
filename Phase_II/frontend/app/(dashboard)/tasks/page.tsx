'use client';

import { useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';

/**
 * Tasks Page
 *
 * Main page for task management with:
 * - TaskList component for displaying and managing tasks
 * - CreateTaskButton for floating action button
 * - Modal for task creation
 * - Protected by middleware (requires authentication)
 * - Uses dashboard layout (header with logout button)
 */
export default function TasksPage() {
  // Modal state for task creation
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskListKey, setTaskListKey] = useState(0); // Key to force TaskList refresh

  /**
   * Handle create button click
   */
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * Handle task creation success
   */
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Force TaskList to refresh by changing its key
    setTaskListKey((prev) => prev + 1);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      {/* Task List */}
      <TaskList key={taskListKey} onCreateClick={handleCreateClick} />

      {/* Floating Create Button */}
      <CreateTaskButton onClick={handleCreateClick} />

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        title="Create Task"
      >
        <TaskForm onSuccess={handleCreateSuccess} onCancel={handleModalClose} />
      </Modal>
    </>
  );
}
