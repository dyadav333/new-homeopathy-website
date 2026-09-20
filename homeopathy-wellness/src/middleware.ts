import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Coarse, fast, edge-level gate: is someone logged in, and does their role
// match the area of the app they're hitting? Fine-grained ownership checks
// (e.g. "is this YOUR appointment") still happen server-side per request —
// this middleware only stops obviously-wrong-role access early.
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/doctor") && role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/patient") && role !== "PATIENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};
