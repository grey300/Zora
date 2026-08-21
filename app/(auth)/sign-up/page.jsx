"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account.");
        setLoading(false);
        return;
      }
      // Auto sign-in after successful registration.
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      setLoading(false);
      if (signInRes?.error) {
        router.push("/sign-in");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Create your Zora account</h1>
        <p className="mt-1 text-sm text-gray-400">
          Start generating AI courses and quizzes.
        </p>

        <div className="mt-6">
          <GoogleButton label="Sign up with Google" />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-800" />
          <span className="text-xs uppercase text-gray-500">or</span>
          <span className="h-px flex-1 bg-gray-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-green-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-green-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-green-500"
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-green-400 underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
