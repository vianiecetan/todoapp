"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame } from 'lucide-react';

interface TodoStatsProps {
  total: number;
  completed: number;
  highPriority: number;
}

export function TodoStats({ total, completed, highPriority }: TodoStatsProps) {
  // Calculate percentage safely
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total Tasks Card */}
      <motion.div
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Circle className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Total</p>
          </div>
        </div>
      </motion.div>

      {/* Completion Percentage Card */}
      <motion.div
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{percentage}%</p>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Done</p>
          </div>
        </div>
      </motion.div>

      {/* High Priority Count Card */}
      <motion.div
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{highPriority}</p>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Urgent</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}