"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, ChevronDown, Image as ImageIcon, Pencil, X, Loader2 } from 'lucide-react';
import { createClient } from "~/utils/supabase/client";
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';
import { toast } from 'sonner';
import type { Todo } from '~/types/todo'; // Import your Todo type

interface TodoItemProps {
  todo: Todo; // Use your central Todo type here
  onToggle: () => void;
  onDelete: () => void;
  // Replace 'any' with Partial<Todo> to fix the "Unexpected any" error
  onUpdate: (updates: Partial<Todo>) => void; 
}

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit State - Use ?? instead of || to fix "Prefer nullish coalescing"
  const [editTask, setEditTask] = useState(todo.task);
  const [editDescription, setEditDescription] = useState(todo.description ?? '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editImageUrl, setEditImageUrl] = useState(todo.image_url ?? '');

  const supabase = createClient();
  const hasDetails = !!(todo.description ?? todo.image_url);

  const handleOpenEdit = () => {
    setEditTask(todo.task);
    setEditDescription(todo.description ?? '');
    setEditPriority(todo.priority);
    setEditImageUrl(todo.image_url ?? '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editTask.trim()) return;
    onUpdate({
      task: editTask.trim(),
      description: editDescription.trim() ?? null,
      priority: editPriority,
      image_url: editImageUrl ?? null,
    });
    setIsEditOpen(false);
    toast.success("Task updated");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `todo-images/${fileName}`;

    try {
      const { error } = await supabase.storage.from('todo-images').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('todo-images').getPublicUrl(filePath);
      setEditImageUrl(publicUrl);
      toast.success("New image uploaded");
    } catch (err) {
      // Log the error or use an underscore if ignored to fix "err is defined but never used"
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "bg-card rounded-xl border border-border transition-all duration-200",
          isHovered ? "shadow-md translate-y-[-2px]" : "shadow-sm"
        )}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onToggle}
              className={cn(
                "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                todo.is_completed ? "bg-green-500 border-green-500" : "border-muted-foreground/30 hover:border-primary"
              )}
            >
              {todo.is_completed && <Check className="w-4 h-4 text-white" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", priorityColors[todo.priority])} />
                <h3 className={cn(
                  "text-lg font-semibold truncate transition-all",
                  todo.is_completed && "text-muted-foreground line-through opacity-60"
                )}>
                  {todo.task}
                </h3>
              </div>

              {hasDetails && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronDown className={cn("w-3 h-3 mr-1 transition-transform", isExpanded && "rotate-180")} />
                  {isExpanded ? "Show less" : "View details"}
                </button>
              )}
            </div>

            <div className={cn("flex gap-1 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleOpenEdit}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pl-10 space-y-3">
                  {todo.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      {todo.description}
                    </p>
                  )}
                  {todo.image_url && (
                    <img 
                      src={todo.image_url} 
                      alt={`Image for task: ${todo.task}`} // Fixed missing alt prop
                      className="rounded-lg max-h-40 w-auto object-cover border border-border shadow-sm" 
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Task Title</label>
              <Input value={editTask} onChange={(e) => setEditTask(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <Button
                    key={p}
                    type="button" // Specified button type
                    variant={editPriority === p ? "default" : "outline"}
                    className="flex-1 capitalize"
                    onClick={() => setEditPriority(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Image Attachment</label>
              {editImageUrl ? (
                <div className="relative group">
                  <img 
                    src={editImageUrl} 
                    alt="Task preview" // Fixed missing alt prop
                    className="rounded-md max-h-32 w-full object-cover" 
                  />
                  <button 
                    type="button"
                    onClick={() => setEditImageUrl('')}
                    className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input type="file" accept="image/*" className="hidden" id="edit-upload" onChange={handleImageUpload} />
                  <label 
                    htmlFor="edit-upload" 
                    className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors"
                  >
                    {isUploading ? <Loader2 className="animate-spin" /> : <ImageIcon className="text-muted-foreground" />}
                  </label>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit} disabled={isUploading || !editTask.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}