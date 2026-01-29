"use client";

import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';

// Local types to avoid import errors
type FilterStatus = 'all' | 'active' | 'completed';
type Priority = 'low' | 'medium' | 'high';

interface TodoFiltersProps {
  status: FilterStatus;
  priority: Priority | 'all';
  onStatusChange: (status: FilterStatus) => void;
  onPriorityChange: (priority: Priority | 'all') => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
];

const priorityFilters: { value: Priority | 'all'; label: string; color?: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High', color: 'bg-red-500' }, // Updated color
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' }, // Updated color
  { value: 'low', label: 'Low', color: 'bg-blue-500' }, // Updated color
];

export function TodoFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  counts,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Status Filter */}
      <div className="flex items-center bg-muted rounded-lg p-1">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              status === filter.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {status === filter.value && (
              <motion.div
                layoutId="status-pill"
                className="absolute inset-0 bg-card rounded-md shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {filter.label}
              <span className="text-xs text-muted-foreground">
                {counts[filter.value]}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-2">Priority:</span>
        {priorityFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onPriorityChange(filter.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
              priority === filter.value
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            {filter.color && (
              <span className={cn("w-1.5 h-1.5 rounded-full", filter.color)} />
            )}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}