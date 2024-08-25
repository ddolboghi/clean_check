import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const {
    data: { user },
  } = await createClient().auth.getUser();

  const protectedRoutes = ["/today-list"];

  const isLoggedIn = user !== null;

  if (protectedRoutes.includes(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
