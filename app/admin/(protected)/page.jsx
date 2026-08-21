import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema";
import { Users as UsersIcon, ShieldCheck, Ban, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [row] = await db
    .select({
      total: sql`count(*)`.mapWith(Number),
      admins: sql`count(*) filter (where ${Users.role} = 'admin')`.mapWith(Number),
      banned: sql`count(*) filter (where ${Users.banned} = true)`.mapWith(Number),
      google: sql`count(*) filter (where ${Users.provider} = 'google')`.mapWith(Number),
    })
    .from(Users);

  const recent = await db
    .select({
      id: Users.id,
      name: Users.name,
      email: Users.email,
      role: Users.role,
      provider: Users.provider,
      createdAt: Users.createdAt,
    })
    .from(Users)
    .orderBy(desc(Users.createdAt))
    .limit(5);

  return { stats: row, recent };
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <Icon size={18} className={accent} />
      </div>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const { stats, recent } = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Overview</h1>
      <p className="mt-1 text-sm text-gray-400">User management at a glance.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UsersIcon} label="Total users" value={stats.total} accent="text-green-400" />
        <StatCard icon={ShieldCheck} label="Admins" value={stats.admins} accent="text-emerald-400" />
        <StatCard icon={UserPlus} label="Google accounts" value={stats.google} accent="text-sky-400" />
        <StatCard icon={Ban} label="Banned" value={stats.banned} accent="text-red-400" />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <h2 className="font-semibold text-white">Recent signups</h2>
          <Link href="/admin/users" className="text-sm text-green-400 hover:underline">
            View all users →
          </Link>
        </div>
        <div className="divide-y divide-gray-800">
          {recent.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-500">No users yet.</p>
          ) : (
            recent.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{u.name || "—"}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-gray-800 px-2 py-1 text-gray-300">
                    {u.provider}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 ${
                      u.role === "admin"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
