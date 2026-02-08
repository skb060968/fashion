import { cookies } from "next/headers"
import crypto from "crypto"

export function requireAdmin() {
  const cookie = cookies().get("admin_session")?.value

  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-session")
    .digest("hex")

  if (!cookie || cookie !== expected) {
    throw new Error("UNAUTHORIZED")
  }
}
