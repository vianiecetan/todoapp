import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createClient } from "~/utils/supabase/server";

export const todoRouter = createTRPCRouter({
  //Get User Todos
  getTodos: publicProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }),

  //Add Todo 
  addTodo: publicProcedure
    .input(z.object({ 
      task: z.string(), 
      description: z.string().optional(), 
      priority: z.enum(['low', 'medium', 'high']).optional(),
      image_url: z.string().optional() 
    }))
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Unauthorized");

      const { data, error } = await supabase
        .from("todos")
        .insert([{ 
          ...input,
          user_id: user.id 
        }])
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  //Update Todo (Allowing all fields to be updated)
  updateTodo: publicProcedure
    .input(z.object({
      id: z.string(),
      task: z.string().optional(),
      description: z.string().nullable().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      is_completed: z.boolean().optional(),
      image_url: z.string().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw new Error(error.message);
      return data;
    }),

  //Delete Todo
  deleteTodo: publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // We add .eq("user_id", user.id) to satisfy RLS policies
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", input.id)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  }),

    
});
