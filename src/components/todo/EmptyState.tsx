"use client";

import { motion } from 'framer-motion';
import { ClipboardList, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        {hasFilters ? (
          <ClipboardList className="w-10 h-10 text-muted-foreground" />
        ) : (
          <Sparkles className="w-10 h-10 text-primary" />
        )}
      </motion.div>
      <h3 className="text-lg font-medium mb-2">
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {hasFilters
          ? 'Try adjusting your filters to see more tasks'
          : 'Start by adding your first task above. You can add descriptions, priorities, and even images!'}
      </p>
    </motion.div>
  );
}