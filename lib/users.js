// Server-side user helpers backed by Drizzle / Neon.
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema";

const normalizeEmail = (email) => String(email || "").toLowerCase().trim();

export async function getUserByEmail(email) {
  const value = normalizeEmail(email);
  if (!value) return null;
  const [user] = await db.select().from(Users).where(eq(Users.email, value));
  return user || null;
}

export async function getUserById(id) {
  if (!id) return null;
  const [user] = await db.select().from(Users).where(eq(Users.id, id));
  return user || null;
}

/**
 * Create a credentials (email/password) user. Throws if the email is taken.
 */
export async function createUser({ name, email, password, role = "user" }) {
  const value = normalizeEmail(email);
  const existing = await getUserByEmail(value);
  if (existing) {
    const err = new Error("EMAIL_TAKEN");
    err.code = "EMAIL_TAKEN";
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(Users)
    .values({
      id: randomUUID(),
      name: name || value.split("@")[0],
      email: value,
      passwordHash,
      role,
      provider: "credentials",
    })
    .returning();
  return user;
}

/**
 * Upsert a Google user into the Users table on first sign-in.
 */
export async function upsertGoogleUser({ name, email, image }) {
  const value = normalizeEmail(email);
  if (!value) return null;
  const existing = await getUserByEmail(value);
  if (existing) return existing;
  const [user] = await db
    .insert(Users)
    .values({
      id: randomUUID(),
      name,
      email: value,
      image,
      provider: "google",
      role: "user",
      emailVerified: new Date(),
    })
    .returning();
  return user;
}

export async function verifyPassword(password, passwordHash) {
  if (!passwordHash) return false;
  return bcrypt.compare(password, passwordHash);
}
