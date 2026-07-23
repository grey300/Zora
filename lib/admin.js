import { auth } from "@/auth";

/**
 * Returns the session if the current user is an admin, otherwise null.
 * Use in server components / route handlers to gate admin-only access.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}
