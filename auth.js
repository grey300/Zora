import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import {
  getUserByEmail,
  verifyPassword,
  upsertGoogleUser,
} from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Let a Google login attach to an existing email account.
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user || !user.passwordHash || user.banned) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const dbUser = await upsertGoogleUser({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        if (!dbUser || dbUser.banned) return false;
      }
      return true;
    },
    // DB-backed jwt: on sign-in, resolve the app user id + role from our table.
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        const email = user.email?.toLowerCase();
        const dbUser = email ? await getUserByEmail(email) : null;
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
        }
      }
      // Allow client-side session.update() to refresh name/image.
      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.picture = session.user.image ?? token.picture;
      }
      return token;
    },
  },
});
