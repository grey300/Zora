import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db
    .select({
      id: Users.id,
      name: Users.name,
      email: Users.email,
      image: Users.image,
      role: Users.role,
      provider: Users.provider,
      banned: Users.banned,
      createdAt: Users.createdAt,
    })
    .from(Users)
    .orderBy(desc(Users.createdAt));

  return NextResponse.json(users);
}
