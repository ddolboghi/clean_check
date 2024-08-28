import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect_to")?.toString();
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      // const isLocalEnv = process.env.NODE_ENV === "development";
      //   if (isLocalEnv) {
      //     // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      //     return NextResponse.redirect(`${origin}${next}`);
      //   } else if (forwardedHost) {
      //     return NextResponse.redirect(`https://${forwardedHost}${next}`);
      //   } else {
      //     return NextResponse.redirect(`${origin}${next}`);
      //   }
      // }
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}${next}`);
    }
  }
  console.log(origin, next);

  // return the user to an error page with instructions
  return NextResponse.redirect("/error");
}
