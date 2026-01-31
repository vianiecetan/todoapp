import { todoRouter } from "~/server/api/routers/todo";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const caller = createCaller(await createTRPCContext());
 * const allTodos = await caller.todo.getTodos();
 */
export const createCaller = createCallerFactory(appRouter); 