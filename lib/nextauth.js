// Server-side session helper (NextAuth v5 / Auth.js).
import { auth } from "@/auth";

export async function getAuthSession() {
  return await auth();
}

export { auth };
