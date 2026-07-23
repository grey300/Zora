import { handlers } from "@/auth";

// bcrypt + Neon DB access require the Node runtime.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
