import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "./lib/globals";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  const jwt = request.cookies.get("Authorization")?.value ?? '';
  const { error } = await supabase.auth.getUser(jwt);

  if (error) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notifications",
    "/settings"
  ]
};
