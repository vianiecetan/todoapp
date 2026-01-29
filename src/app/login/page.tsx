"use client";
import { useState } from "react";
import { createClient } from "~/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This is where the user returns after clicking the email link
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setMessage(error.message);
    else setMessage("Check your email for the magic link!");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 border rounded-lg shadow-md bg-white w-96">
        <h1 className="text-2xl font-bold mb-4">Todo Login</h1>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}