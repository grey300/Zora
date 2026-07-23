import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminShell from "../_components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/admin/login");
  }
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
