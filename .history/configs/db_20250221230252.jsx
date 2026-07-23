import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

console.log("🔍 DATABASE_URL:", process.env.NEXT_PUBLIC_DB_CONNECTION_STRING); // Debugging

if (!process.env.NEXT_PUBLIC_DB_CONNECTION_STRING) {
  throw new Error("❌ DATABASE_URL is missing. Check .env.local or .env file.");
}

const sql = neon(process.env.NEXT_PUBLIC_DB_CONNECTION_STRING);
export const db = drizzle(sql);
