import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Server-only. DB_CONNECTION_STRING must NOT use the NEXT_PUBLIC_ prefix —
// that would inline the database password into the browser bundle.
const sql = neon(
  process.env.DB_CONNECTION_STRING ||
    process.env.NEXT_PUBLIC_DB_CONNECTION_STRING
);
export const db = drizzle(sql, { schema });
