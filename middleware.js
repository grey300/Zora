import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

// Routes that require a logged-in (any role) user.
const protectedPrefixes = ["/dashboard", "/history", "/create-course"];

const isUnder = (path, prefix) => path === prefix || path.startsWith(prefix + "/");

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  // ----- Admin area (role-gated) -----
  if (isUnder(path, "/admin")) {
    if (path === "/admin/login") {
      if (isLoggedIn && role === "admin") {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      }
      return NextResponse.next();
    }
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // ----- Auth pages: bounce already-authenticated users -----
  if (path === "/sign-in" || path === "/sign-up") {
    if (isLoggedIn) {
      const dest = role === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, nextUrl));
    }
    return NextResponse.next();
  }

  // ----- Admins land on the admin dashboard, not the user dashboard -----
  if (isLoggedIn && role === "admin" && (path === "/" || path === "/dashboard")) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  // ----- Protected app routes -----
  if (protectedPrefixes.some((p) => isUnder(path, p)) && !isLoggedIn) {
    const url = new URL("/sign-in", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // ----- Landing page: send logged-in users to their dashboard -----
  if (path === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
