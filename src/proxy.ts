import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "@/lib/session";

const COOKIE_NAME = "session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginRoute = pathname === "/admin/login";
  const isProtectedRoute = pathname.startsWith("/admin") && !isLoginRoute;

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
