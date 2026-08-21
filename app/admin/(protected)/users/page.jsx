"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Trash2, ShieldCheck, ShieldOff, Ban, Check } from "lucide-react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patchUser = async (id, body) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed.");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    } catch {
      setError("Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user permanently? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Delete failed.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      !q ||
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-400">
            {users.length} total • manage roles, bans and accounts.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-green-500"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-gray-800 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Provider</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  Loading users…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const isSelf = u.id === currentUserId;
                const busy = busyId === u.id;
                return (
                  <tr key={u.id} className="text-gray-200">
                    <td className="px-5 py-3">
                      <div className="font-medium text-white">
                        {u.name || "—"} {isSelf && <span className="text-xs text-green-400">(you)</span>}
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
                        {u.provider}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          u.role === "admin"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {u.banned ? (
                        <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs text-red-400">
                          banned
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-400">
                          active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isSelf || busy}
                          onClick={() =>
                            patchUser(u.id, {
                              role: u.role === "admin" ? "user" : "admin",
                            })
                          }
                          title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                          className="rounded-md border border-gray-700 p-1.5 text-gray-300 transition hover:bg-gray-800 disabled:opacity-40"
                        >
                          {u.role === "admin" ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                        </button>
                        <button
                          disabled={isSelf || busy}
                          onClick={() => patchUser(u.id, { banned: !u.banned })}
                          title={u.banned ? "Unban" : "Ban"}
                          className="rounded-md border border-gray-700 p-1.5 text-gray-300 transition hover:bg-gray-800 disabled:opacity-40"
                        >
                          {u.banned ? <Check size={15} /> : <Ban size={15} />}
                        </button>
                        <button
                          disabled={isSelf || busy}
                          onClick={() => deleteUser(u.id)}
                          title="Delete user"
                          className="rounded-md border border-gray-700 p-1.5 text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
