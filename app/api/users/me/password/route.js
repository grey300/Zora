import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema";
import { auth } from "@/auth";

export const runtime = "nodejs";

// POST { currentPassword?, newPassword } → change (or set) the caller's password.
// Google-only accounts (no password yet) may set one without a current password.
export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const newPassword = String(body.newPassword || "");
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const [user] = await db
    .select()
    .from(Users)
    .where(eq(Users.id, session.user.id));
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (user.passwordHash) {
    const ok = await bcrypt.compare(
      String(body.currentPassword || ""),
      user.passwordHash
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db
    .update(Users)
    .set({ passwordHash })
    .where(eq(Users.id, session.user.id));

  return NextResponse.json({ success: true });
}
