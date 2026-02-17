import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) {
    redirect("/admin-login");
  }

  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-session")
    .digest("hex");

  if (session !== expected) {
    redirect("/admin-login");
  }

  return <>{children}</>;
}
