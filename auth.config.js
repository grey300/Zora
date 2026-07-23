// Edge-safe NextAuth config (no DB / bcrypt imports).
// Used by middleware.js for session decoding + route protection.
// The full config in auth.js spreads this and adds the DB-backed providers.

/** @type {import("next-auth").NextAuthConfig} */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  // Providers are added in auth.js (they need bcrypt / DB which aren't edge-safe).
  providers: [],
  callbacks: {
    // Edge-safe: only copies already-present claims. The DB lookup lives in auth.js.
    jwt({ token, user }) {
      if (user) {
        if (user.id) token.id = user.id;
        if (user.role) token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
};
