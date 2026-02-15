import { NextResponse } from "next/server";
import crypto from "crypto";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-session")
    .digest("hex");

  // ✅ Set cookie on the response, not via cookies()
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 1, // ⏰ 1 hour
  });

  return res;
}