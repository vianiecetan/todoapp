"use client";
import { useState } from "react";
import { createClient } from "~/utils/supabase/client";

export default function AuthUI() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await supabase.auth.signUp({ email, password });
      alert("Check your email for a confirmation link!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else window.location.href = "/todos"; // Force refresh to trigger middleware
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button className="w-full py-2 bg-primary text-white rounded">
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-sm text-muted-foreground"
      >
        {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
      </button>
    </div>
  );
}