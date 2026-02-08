import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function POST(req: Request) {
  const { email, password } = await req.json()


  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-session")
    .digest("hex")

  cookies().set("admin_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 1, // ⏰ 1 hours
})


  return NextResponse.json({ success: true })
}
