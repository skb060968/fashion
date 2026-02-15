import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { formatRupees } from "@/lib/money";
import { formatDateDDMMYYYY } from "@/lib/date";
import { unstable_noStore as noStore } from "next/cache";

// ✅ Prevent caching at the browser and Next.js level
export const revalidate = 0;

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    UNDER_VERIFICATION: "bg-yellow-200 text-yellow-800",
    VERIFIED: "bg-green-200 text-green-800",
    REJECTED: "bg-red-200 text-red-800",
    PROCESSING: "bg-blue-200 text-blue-800",
    SHIPPED: "bg-purple-200 text-purple-800",
    DELIVERED: "bg-green-300 text-green-900",
    CANCELLED: "bg-gray-300 text-gray-800",
    REFUNDED: "bg-pink-200 text-pink-800",
  };

  const style = colors[status] || "bg-gray-200 text-gray-800";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}

export default async function AdminPage() {
  // 🚫 Prevent caching so Back button can't reopen dashboard
  noStore();

  // 🔒 Hard admin lock: redirect to login if not authenticated
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      discount: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <section className="pt-28 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold">Admin Orders</h1>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-md border border-stone-300 hover:bg-stone-100 transition"
          >
            Logout
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-100 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Amount Paid</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const subtotal = order.amount + (order.discount ?? 0);
              return (
                <tr key={order.id} className="border-t hover:bg-stone-50">
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-fashion-gold hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="p-4">{formatRupees(subtotal)}</td>
                  <td className="p-4">
                    {order.discount && order.discount > 0
                      ? `-${formatRupees(order.discount)}`
                      : "—"}
                  </td>
                  <td className="p-4 font-semibold">
                    {formatRupees(order.amount)}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDateDDMMYYYY(order.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="p-6 text-center text-gray-500">No orders found</p>
        )}
      </div>
    </section>
  );
}