export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  task: string;
  description: string | null;
  priority: Priority;
  is_completed: boolean;
  image_url: string | null;
  created_at: string;
  user_id: string;
}