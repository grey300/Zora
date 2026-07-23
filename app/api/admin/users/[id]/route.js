import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

// Update a user's role or banned status.
export async function PATCH(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot change your own role or status." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const update = {};

  if (typeof body.role === "string") {
    if (!["user", "admin"].includes(body.role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    update.role = body.role;
  }
  if (typeof body.banned === "boolean") {
    update.banned = body.banned;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const [updated] = await db
    .update(Users)
    .set(update)
    .where(eq(Users.id, id))
    .returning({
      id: Users.id,
      name: Users.name,
      email: Users.email,
      role: Users.role,
      banned: Users.banned,
    });

  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// Delete a user.
export async function DELETE(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  const [deleted] = await db
    .delete(Users)
    .where(eq(Users.id, id))
    .returning({ id: Users.id });

  if (!deleted) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: deleted.id });
}
