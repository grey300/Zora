import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * POST multipart/form-data { file, kind: "avatar" | "banner" }
 * Signed server-side upload to Cloudinary — the API secret never leaves
 * the server, and only signed-in users can upload.
 */
export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Image uploads are not configured yet (missing Cloudinary keys)." },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const kind = formData.get("kind") === "banner" ? "banner" : "avatar";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
    }

    const folder = `zora/${kind}s`;
    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary signature: sha1 of sorted params + api_secret
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const upload = new FormData();
    upload.append("file", file);
    upload.append("api_key", apiKey);
    upload.append("timestamp", String(timestamp));
    upload.append("folder", folder);
    upload.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: upload }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("Cloudinary upload failed:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Upload failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
