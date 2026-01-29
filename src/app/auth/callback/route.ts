import { NextResponse } from "next/server";
import { createClient } from "~/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in params, use it as the redirect URL (default to /todos)
  const next = searchParams.get("next") ?? "/todos";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // The session is now stored in the cookie
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something goes wrong, send them back to the login page with an error
  return NextResponse.redirect(`${origin}/?error=Could not authenticate user`);
}