import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log(request);
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
