"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, CheckCircle2 } from 'lucide-react';
import { api } from "~/trpc/react";
import { createClient } from "~/utils/supabase/client";

// UI Components
import { TodoForm } from '~/components/todo/TodoForm';
import { TodoItem } from '~/components/todo/TodoItem';
import { TodoFilters } from '~/components/todo/TodoFilters';
import { EmptyState } from '~/components/todo/EmptyState';
import { TodoStats } from '~/components/todo/TodoStats'; // Added this import
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';

export default function TodoPage() {
  const router = useRouter();
  const supabase = createClient();
  const utils = api.useUtils();

  // 1. Data Fetching
  const { data: todos = [], isLoading } = api.todo.getTodos.useQuery();

  // 2. Mutations
  const addMutation = api.todo.addTodo.useMutation({
    onSuccess: () => {
      toast.success("Task created!");
      void utils.todo.getTodos.invalidate();
    },
  });

  const updateMutation = api.todo.updateTodo.useMutation({
    onSuccess: () => void utils.todo.getTodos.invalidate(),
    onError: (err) => toast.error(err.message),
  });

  // 1. Simplify the mutation
const deleteMutation = api.todo.deleteTodo.useMutation();

// 2. Create the handler function
const handleDelete = async (id: string) => {

  const deleteProcess = async () => {

    await deleteMutation.mutateAsync({ id });
    
    await utils.todo.getTodos.refetch();
  };

  toast.promise(deleteProcess(), {
    loading: 'Deleting task...',
    success: 'Task deleted!',
    error: (err) => `Error: ${err.message}`,
  });
};

  // 3. Realtime Updates
  useEffect(() => {
  const channel = supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "todos" },
      (payload) => {
        console.log("Realtime change:", payload.eventType);
        // Force a hard refresh of the tRPC query
        void utils.todo.getTodos.refetch(); 
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}, [supabase, utils]);

  // 4. State & Filtering Logic
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !todo.is_completed) ||
        (statusFilter === 'completed' && todo.is_completed);

      const priorityMatch =
        priorityFilter === 'all' || todo.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });
  }, [todos, statusFilter, priorityFilter]);

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.is_completed).length,
    completed: todos.filter((t) => t.is_completed).length,
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.is_completed).length,
    highPriority: todos.filter((t) => t.priority === "high" && !t.is_completed).length,
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <CheckCircle2 className="w-10 h-10 text-primary opacity-20" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground text-sm">Stay organized, stay productive</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
          </Button>
        </header>

        {/* Stats Section */}
        <div className="mb-8">
          <TodoStats {...stats} />
        </div>

        {/* Form Section */}
        <div className="mb-8">
          <TodoForm 
            onAdd={(task, description, priority, image_url) => 
              addMutation.mutate({ task, description, priority, image_url })
            } 
          />
        </div>

        {/* Filters Section */}
        {todos.length > 0 && (
          <div className="mb-6">
            <TodoFilters
              status={statusFilter}
              priority={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              counts={counts}
            />
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={() => 
                    updateMutation.mutate({ id: todo.id, is_completed: !todo.is_completed })
                  }
                  onDelete={() => handleDelete(todo.id)}
                  onUpdate={(updates) => 
                    updateMutation.mutate({ id: todo.id, ...updates })
                  }
                />
              ))
            ) : (
              <EmptyState hasFilters={statusFilter !== 'all' || priorityFilter !== 'all'} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}