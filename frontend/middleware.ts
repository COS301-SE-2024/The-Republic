import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "./lib/globals";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  const jwt = request.cookies.get("Authorization")?.value ?? '';
  const { data: authData } = await supabase.auth.getUser(jwt);

  if (url.pathname.includes("admin")) {
    let role: string | undefined;

    if (authData.user) {
      const { data: dbData } = await supabase
        .from("user")
        .select("*, user_role ( role )")
        .eq("user_id", authData.user!.id)
        .single();

      if (dbData) {
        role = dbData.user_role.role;
      }
    }

    if (role !== "admin") {
      return NextResponse.rewrite(new URL("/not-found", url.origin));
    }
  }

  if (!authData.user) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notifications",
    "/settings",
    "/admin(/.+)*"
 ]
};
