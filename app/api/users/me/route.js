import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema";
import { auth } from "@/auth";

export const runtime = "nodejs";

// GET → the caller's profile
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select({
      id: Users.id,
      name: Users.name,
      email: Users.email,
      image: Users.image,
      provider: Users.provider,
      role: Users.role,
      hasPassword: Users.passwordHash,
      createdAt: Users.createdAt,
    })
    .from(Users)
    .where(eq(Users.id, session.user.id));

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  return NextResponse.json({ ...user, hasPassword: !!user.hasPassword });
}

// PATCH { name?, image? } → update the caller's profile
export async function PATCH(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const update = {};
  if (typeof body.name === "string" && body.name.trim()) {
    update.name = body.name.trim().slice(0, 255);
  }
  if (typeof body.image === "string") {
    update.image = body.image.slice(0, 1000);
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const [updated] = await db
    .update(Users)
    .set(update)
    .where(eq(Users.id, session.user.id))
    .returning({ id: Users.id, name: Users.name, image: Users.image });

  return NextResponse.json(updated);
}
