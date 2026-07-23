"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, LogOut, ShieldCheck } from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminShell({ user, children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-gray-800 bg-gray-900 p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <ShieldCheck className="text-indigo-400" size={22} />
          <span className="text-lg font-bold">Zora Admin</span>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="mb-3 px-2">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || "Admin"}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
