'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileJson, FileSpreadsheet, FileCode, Printer, ChevronDown } from 'lucide-react';
import { Task } from '@/lib/types';
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  exportToPDF,
  exportToMarkdown
} from '@/lib/export-utils';

interface ExportDropdownProps {
  tasks: Task[];
  disabled?: boolean;
}

/**
 * Export Dropdown Component
 * Provides multiple export format options with icons and descriptions
 */
export default function ExportDropdown({ tasks, disabled = false }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleExport = (format: string) => {
    setIsOpen(false);

    if (tasks.length === 0) {
      alert('No tasks to export');
      return;
    }

    switch (format) {
      case 'csv':
        exportToCSV(tasks);
        break;
      case 'json':
        exportToJSON(tasks);
        break;
      case 'excel':
        exportToExcel(tasks);
        break;
      case 'pdf':
        exportToPDF(tasks);
        break;
      case 'markdown':
        exportToMarkdown(tasks);
        break;
    }
  };

  const exportOptions = [
    {
      id: 'csv',
      label: 'Export as CSV',
      description: 'Comma-separated values for Excel',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'excel',
      label: 'Export as Excel',
      description: 'Microsoft Excel format (.xls)',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100'
    },
    {
      id: 'json',
      label: 'Export as JSON',
      description: 'JavaScript Object Notation',
      icon: FileJson,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'pdf',
      label: 'Export as PDF',
      description: 'Printable document format',
      icon: Printer,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      id: 'markdown',
      label: 'Export as Markdown',
      description: 'Markdown formatted text (.md)',
      icon: FileCode,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || tasks.length === 0}
        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 ${
          disabled || tasks.length === 0
            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
            : 'border-slate-300 hover:bg-slate-50 text-slate-700 hover:border-slate-400'
        }`}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Export Tasks</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} will be exported
            </p>
          </div>

          {/* Export Options */}
          <div className="py-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 transition-all duration-200 ${option.hoverColor}`}
                >
                  <div className={`${option.bgColor} ${option.color} p-2 rounded-lg flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-slate-900">{option.label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{option.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Choose a format to download your tasks
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
