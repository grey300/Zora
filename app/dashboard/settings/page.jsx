"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Loader2, User, KeyRound } from "lucide-react";

function SectionCard({ icon: Icon, title, desc, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#11151D]">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-indigo-500" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = React.useState(null);
  const [name, setName] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [profileMsg, setProfileMsg] = React.useState(null);

  const [pwd, setPwd] = React.useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = React.useState(false);
  const [pwdMsg, setPwdMsg] = React.useState(null);

  const fileRef = React.useRef(null);

  React.useEffect(() => {
    fetch("/api/users/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setName(data.name || "");
        }
      })
      .catch(() => {});
  }, []);

  const saveProfile = async (imageOverride) => {
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const payload = { name };
      if (imageOverride) payload.image = imageOverride;
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setProfile((p) => ({ ...p, ...data }));
      // Refresh the session so the header/avatar update immediately.
      await update({ user: { name: data.name, image: data.image } });
      setProfileMsg({ ok: true, text: "Profile updated ✓" });
    } catch (error) {
      setProfileMsg({ ok: false, text: error.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const onAvatarSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProfileMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "avatar");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      await saveProfile(data.url);
    } catch (error) {
      setProfileMsg({ ok: false, text: error.message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ ok: false, text: "New passwords don't match." });
      return;
    }
    setSavingPwd(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwd.current,
          newPassword: pwd.next,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed.");
      setPwd({ current: "", next: "", confirm: "" });
      setPwdMsg({ ok: true, text: "Password updated ✓" });
    } catch (error) {
      setPwdMsg({ ok: false, text: error.message });
    } finally {
      setSavingPwd(false);
    }
  };

  const avatar = profile?.image || session?.user?.image;
  const needsCurrent = profile?.hasPassword;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and account security.
        </p>
      </div>

      {/* Profile */}
      <SectionCard icon={User} title="Profile" desc="Your name and photo, shown on your courses.">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="group relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              title="Change photo"
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                  {(name || profile?.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                {uploading ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <Camera size={20} className="text-white" />
                )}
              </span>
            </button>
            <span className="text-xs text-muted-foreground">Tap to change</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarSelected}
            />
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input value={profile?.email || ""} disabled className="opacity-60" />
              <p className="mt-1 text-xs text-muted-foreground">
                Signed up via {profile?.provider === "google" ? "Google" : "email"} — email can&apos;t be changed.
              </p>
            </div>
            <Button onClick={() => saveProfile()} disabled={savingProfile || uploading}>
              {savingProfile && <Loader2 size={15} className="mr-2 animate-spin" />}
              Save profile
            </Button>
            {profileMsg && (
              <p className={`text-sm ${profileMsg.ok ? "text-emerald-500" : "text-red-500"}`}>
                {profileMsg.text}
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Password */}
      <SectionCard
        icon={KeyRound}
        title={needsCurrent ? "Change password" : "Set a password"}
        desc={
          needsCurrent
            ? "Update the password you use to sign in."
            : "You signed up with Google — set a password to also sign in with email."
        }
      >
        <form onSubmit={changePassword} className="max-w-sm space-y-4">
          {needsCurrent && (
            <div>
              <label className="mb-1 block text-sm font-medium">Current password</label>
              <Input
                type="password"
                value={pwd.current}
                onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">New password</label>
            <Input
              type="password"
              minLength={8}
              value={pwd.next}
              onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm new password</label>
            <Input
              type="password"
              minLength={8}
              value={pwd.confirm}
              onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" disabled={savingPwd}>
            {savingPwd && <Loader2 size={15} className="mr-2 animate-spin" />}
            {needsCurrent ? "Change password" : "Set password"}
          </Button>
          {pwdMsg && (
            <p className={`text-sm ${pwdMsg.ok ? "text-emerald-500" : "text-red-500"}`}>
              {pwdMsg.text}
            </p>
          )}
        </form>
      </SectionCard>
    </div>
  );
}
