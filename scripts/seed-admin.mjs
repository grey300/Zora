// Seed / update the first admin account from environment variables.
//   npm run seed:admin
// Reads ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME and NEXT_PUBLIC_DB_CONNECTION_STRING.
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const url =
  process.env.DB_CONNECTION_STRING ||
  process.env.NEXT_PUBLIC_DB_CONNECTION_STRING ||
  process.env.DATABASE_URL;
const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || "";
const name = process.env.ADMIN_NAME || "Admin";

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

if (!url) fail("Missing NEXT_PUBLIC_DB_CONNECTION_STRING in your .env");
if (!email) fail("Missing ADMIN_EMAIL in your .env");
if (!password) fail("Missing ADMIN_PASSWORD in your .env");
if (password.length < 8) fail("ADMIN_PASSWORD must be at least 8 characters");

const sql = neon(url);

const hash = await bcrypt.hash(password, 10);

const existing = await sql`SELECT id FROM users WHERE email = ${email}`;

if (existing.length > 0) {
  await sql`
    UPDATE users
    SET role = 'admin',
        "passwordHash" = ${hash},
        name = ${name},
        banned = false
    WHERE email = ${email}
  `;
  console.log(`\n✔ Updated existing account "${email}" and set role = admin\n`);
} else {
  const id = randomUUID();
  await sql`
    INSERT INTO users (id, name, email, "passwordHash", role, provider)
    VALUES (${id}, ${name}, ${email}, ${hash}, 'admin', 'credentials')
  `;
  console.log(`\n✔ Created admin account "${email}"\n`);
}

console.log("You can now sign in at /admin/login");
process.exit(0);
