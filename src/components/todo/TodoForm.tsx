"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, X, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createClient } from "~/utils/supabase/client";
import { cn } from '~/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Priority = 'low' | 'medium' | 'high';

interface TodoFormProps {
  onAdd: (title: string, description?: string, priority?: Priority, imageUrl?: string) => void;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

export function TodoForm({ onAdd }: TodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `todo-images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('todo-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('todo-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isUploading) return;
    
    onAdd(title.trim(), description.trim() || undefined, priority, imageUrl);
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    setImageUrl(undefined);
    setIsExpanded(false);
  };

  const currentPriority = priorityOptions.find(p => p.value === priority)!;

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="bg-card rounded-lg shadow-md border" 
      layout
    >
      <div className="p-4">
        <div className="flex gap-3 items-center">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value && !isExpanded) setIsExpanded(true);
            }}
            placeholder="Add a new task..."
            className="border-0 bg-transparent px-0 text-base focus-visible:ring-0 placeholder:text-muted-foreground/60"
          />
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="pt-4 pl-9 space-y-4">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description (optional)"
                  className="min-h-[60px] resize-none"
                />

                {imageUrl && (
                  <div className="relative w-full max-w-xs">
                    <img src={imageUrl} alt="Preview" className="rounded-lg w-full h-32 object-cover border" />
                    <Button
                      type="button" variant="secondary" size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white"
                      onClick={() => setImageUrl(undefined)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Button
                      type="button" variant="ghost" size="sm" className="h-8"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-1.5" />}
                      Image
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-8">
                          <span className={cn("w-2 h-2 rounded-full mr-1.5", currentPriority.color)} />
                          {currentPriority.label}
                          <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[120px]">
                        {priorityOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setPriority(option.value)}
                          >
                            <span className={cn("w-2 h-2 rounded-full", option.color)} />
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={!title.trim() || isUploading}>Add Task</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}