import { Task } from './types';
import { format } from 'date-fns';

/**
 * Export Utilities for Tasks
 * Supports multiple export formats: CSV, JSON, PDF, Excel
 */

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Export tasks as CSV
 */
export function exportToCSV(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Due Date',
    'Completed',
    'Project',
    'Tags',
    'Created At',
    'Updated At',
    'Completed At'
  ];

  // Convert tasks to CSV rows
  const rows = tasks.map(task => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`, // Escape quotes
    `"${(task.description || '').replace(/"/g, '""')}"`,
    task.status,
    task.priority,
    task.due_date || '',
    task.is_complete ? 'Yes' : 'No',
    task.project?.name || '',
    task.tags?.map(t => t.name).join('; ') || '',
    task.created_at,
    task.updated_at,
    task.completed_at || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('/n');

  // Create and download file
  downloadFile(csvContent, generateFilename('tasks', 'csv'), 'text/csv');
}

/**
 * Export tasks as JSON
 */
export function exportToJSON(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    totalTasks: tasks.length,
    tasks: tasks
  }, null, 2);

  downloadFile(jsonContent, generateFilename('tasks', 'json'), 'application/json');
}

/**
 * Export tasks as Excel (XLSX) - using CSV format with .xlsx extension
 * For true Excel support, you'd need a library like xlsx or exceljs
 */
export function exportToExcel(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  // For now, we'll use CSV format with Excel-friendly formatting
  // In production, consider using the 'xlsx' library for true Excel files
  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Due Date',
    'Completed',
    'Project',
    'Tags',
    'Created At',
    'Updated At',
    'Completed At'
  ];

  const rows = tasks.map(task => [
    task.id,
    task.title,
    task.description || '',
    task.status,
    task.priority,
    task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : '',
    task.is_complete ? 'Yes' : 'No',
    task.project?.name || '',
    task.tags?.map(t => t.name).join('; ') || '',
    format(new Date(task.created_at), 'yyyy-MM-dd HH:mm:ss'),
    format(new Date(task.updated_at), 'yyyy-MM-dd HH:mm:ss'),
    task.completed_at ? format(new Date(task.completed_at), 'yyyy-MM-dd HH:mm:ss') : ''
  ]);

  // Create CSV content with tab separator for better Excel compatibility
  const csvContent = [
    headers.join('/t'),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join('/t'))
  ].join('/n');

  downloadFile(csvContent, generateFilename('tasks', 'xls'), 'application/vnd.ms-excel');
}

/**
 * Export tasks as PDF (using HTML to PDF conversion)
 */
export function exportToPDF(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tasks Export</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        h1 {
          color: #10b981;
          border-bottom: 3px solid #10b981;
          padding-bottom: 10px;
        }
        .meta {
          color: #666;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #10b981;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-todo { background-color: #e5e7eb; color: #374151; }
        .status-in_progress { background-color: #dbeafe; color: #1e40af; }
        .status-review { background-color: #fef3c7; color: #92400e; }
        .status-done { background-color: #d1fae5; color: #065f46; }
        .priority {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .priority-low { background-color: #e5e7eb; color: #374151; }
        .priority-medium { background-color: #dbeafe; color: #1e40af; }
        .priority-high { background-color: #fed7aa; color: #9a3412; }
        .priority-urgent { background-color: #fecaca; color: #991b1b; }
        .completed { color: #10b981; font-weight: bold; }
        .incomplete { color: #ef4444; }
      </style>
    </head>
    <body>
      <h1>Pure Tasks Export</h1>
      <div class="meta">
        <p><strong>Export Date:</strong> ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}</p>
        <p><strong>Total Tasks:</strong> ${tasks.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(task => `
            <tr>
              <td><strong>${escapeHtml(task.title)}</strong><br>
                  <small style="color: #666;">${escapeHtml(task.description || '')}</small>
              </td>
              <td><span class="status status-${task.status}">${task.status.replace('_', ' ').toUpperCase()}</span></td>
              <td><span class="priority priority-${task.priority}">${task.priority.toUpperCase()}</span></td>
              <td>${task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}</td>
              <td class="${task.is_complete ? 'completed' : 'incomplete'}">${task.is_complete ? '✓ Yes' : '✗ No'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    alert('Please allow pop-ups to export as PDF');
  }
}

/**
 * Export tasks as Markdown
 */
export function exportToMarkdown(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  const markdownContent = `# Pure Tasks Export

**Export Date:** ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}
**Total Tasks:** ${tasks.length}

---

${tasks.map(task => `
## ${task.title}

- **Status:** ${task.status.replace('_', ' ').toUpperCase()}
- **Priority:** ${task.priority.toUpperCase()}
- **Due Date:** ${task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
- **Completed:** ${task.is_complete ? 'Yes ✓' : 'No ✗'}
${task.project ? `- **Project:** ${task.project.name}` : ''}
${task.tags && task.tags.length > 0 ? `- **Tags:** ${task.tags.map(t => t.name).join(', ')}` : ''}

${task.description ? `**Description:**/n${task.description}` : ''}

---
`).join('/n')}
`;

  downloadFile(markdownContent, generateFilename('tasks', 'md'), 'text/markdown');
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper function to escape HTML
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get export statistics
 */
export function getExportStats(tasks: Task[]) {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.is_complete).length,
    active: tasks.filter(t => !t.is_complete).length,
    byStatus: {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    },
    byPriority: {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
    }
  };
}
