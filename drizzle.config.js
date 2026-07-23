import dotenv from "dotenv";

// Load env from .env.local (if present) then fall back to .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./configs/schema.jsx",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DB_CONNECTION_STRING ||
      process.env.NEXT_PUBLIC_DB_CONNECTION_STRING,
  },
};
