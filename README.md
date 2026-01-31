# Taskly (Todo App)
A full-stack, real-time Task Management application built with the T3 Stack and Supabase. This project features secure authentication, image uploads, and real-time database synchronization.

## Features
Standard Requirements
User Authentication: Secure login/signup via Supabase Auth (Email).

CRUD Operations: 
- Get: Fetch user-specific tasks with tRPC queries.

- Insert: Add tasks with title, description, and priority levels.

- Update: Toggle completion status and edit task details inline.

- Delete: Remove tasks with immediate UI feedback and backend verification.

- Media Support: Upload and host images for specific tasks using Supabase Storage.

## Advanced Requirements
Real-time Updates: Utilizes Supabase Postgres Changes to reflect database updates across all clients instantly without manual refreshing.

Multi-tenant Architecture: Row Level Security (RLS) ensures that users can only access, modify, or delete their own data.

## Tech Stack
Framework: Next.js 14 (App Router)

Language: TypeScript

Backend API: tRPC

Database & Auth: Supabase

Styling: Tailwind CSS + Shadcn UI

## Installation & Setup
Clone the repository: ```bash git clone https://github.com/vianiecetan/todoapp.git```

Install dependencies: 

```cd todoapp ``` 

```bash npm install ```

### Configure Environment Variables: 

Create a .env file in the root directory and add your Supabase credentials

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
### Database Setup
Run the following SQL in your Supabase SQL Editor to enable RLS

```SQL 
SQL
-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own todos" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own todos" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own todos" ON todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos" ON todos FOR DELETE USING (auth.uid() = user_id);
```
### Run the app:

```bash
npm run dev
```

## Middleware & Security
The app includes a custom middleware.ts that

- Protects the /todos route from unauthorized access.

- Redirects unauthenticated users back to the landing page.

- Handles server-side session refreshes to prevent "stale" logins.

## Documentations
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [T3 Stack](https://create.t3.gg/)
- [Vercel](https://create.t3.gg/en/deployment/vercel)

## Deployment
This project is configured for one-click deployment on Vercel. Ensure all Environment Variables are added to the Vercel Dashboard settings before building.

[TODO App Deployed Link](https://todoapp-psez-l9t04tx19-vianieces-projects.vercel.app/)
