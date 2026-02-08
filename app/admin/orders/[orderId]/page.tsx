import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/adminAuth"
import AdminOrderDetailClient from "./AdminOrderDetailClient"

export default function AdminOrderPage() {
  /* 🔒 HARD admin lock */
  try {
    requireAdmin()
  } catch {
    redirect("/admin/login")
  }

  return <AdminOrderDetailClient />
}
