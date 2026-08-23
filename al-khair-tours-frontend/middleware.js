import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const COOKIE_NAME = "admin_token";

export async function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  // Ask the Express API whether this token is still valid — keeps auth logic
  // in one place (the Express server) instead of duplicating JWT verification here.
  let isValid = false;
  if (token) {
    try {
      const res = await fetch(`${API_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      isValid = res.ok;
    } catch {
      isValid = false;
    }
  }

  if (isAdminRoute && !isLoginRoute && !isValid) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && isValid) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
