import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const {
    data: { user },
  } = await createClient().auth.getUser();
  // console.log("유저 정보 middleware: ", user);

  const protectedRoutes = ["/main", "/search", "/storage"];

  const isLoggedIn = user !== null;

  if (protectedRoutes.includes(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
