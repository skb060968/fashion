import { cookies } from "next/headers";
import crypto from "crypto";

export async function requireAdmin() {
  // ✅ Await cookies() before using .get
  const cookieStore = await cookies();
  const cookie = cookieStore.get("admin_session")?.value;

  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-session")
    .digest("hex");

  if (!cookie || cookie !== expected) {
    throw new Error("UNAUTHORIZED");
  }
}