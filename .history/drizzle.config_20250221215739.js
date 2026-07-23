/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./config/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
