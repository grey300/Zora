import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL); // Debugging

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing. Check .env.local or .env file.");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
