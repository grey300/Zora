import dotenv from "dotenv";

// Load .env.local file
dotenv.config({ path: ".env.local" });

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./configs/schema.jsx",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DB_CONNECTION_STRING, // Access variable from .env.local
  },
};
