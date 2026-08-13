import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
const SESSION_COOKIE = "__Host-lexasession";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  const isPublic = pathname === "/login" || pathname.startsWith("/api/");
  if (isPublic) return NextResponse.next();

  if (!session?.value) {
    const loginUrl = new URL("/login", AUTH_URL);
    loginUrl.searchParams.set("redirect", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    const vpnHeader = request.headers.get("x-vpn-authorized");
    if (vpnHeader !== "true" && process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
