"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import { formatDateDDMMYYYY } from "@/lib/date";

interface OrderItem {
  id: string;
  name: string;
  slug: string;
  size: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface StatusHistory {
  id: string;
  status: string;
  changedAt: string;
}

interface Order {
  orderCode: string;      // 👈 use orderCode instead of id
  amount: number;
  discount?: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  address?: Address;
  items: OrderItem[];
  history?: StatusHistory[];
}

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderCode = params?.orderId as string; // 👈 param is actually orderCode
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderCode) return;
    async function fetchOrder() {
      const res = await fetch(`/api/admin/orders/${orderCode}`); // 👈 fetch by orderCode
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    }
    fetchOrder();
  }, [orderCode]);

  async function updateStatus(newStatus: string) {
    if (!orderCode) return;
    const res = await fetch(`/api/admin/orders/${orderCode}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(updated);
    } else {
      alert("Failed to update status");
    }
  }

  if (!order) return <div>Loading...</div>;

  const subtotal = order.amount + (order.discount ?? 0);
  const discountAmount = order.discount ?? 0;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Order Detail – Code {order.orderCode} {/* 👈 show boutique code */}
      </h1>

      {/* Status dropdown */}
      <div className="flex items-center space-x-4">
        <span className="font-medium">Current Status:</span>
        <StatusBadge status={order.status} />
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="UNDER_VERIFICATION">Under Verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Payment */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Payment</h2>
        <p>Method: {order.paymentMethod}</p>
        <p>Subtotal: {formatRupees(subtotal)}</p>
        {discountAmount > 0 && (
          <p>Discount: -{formatRupees(discountAmount)}</p>
        )}
        <p className="font-bold">Amount Paid: {formatRupees(order.amount)}</p>
      </div>

      {/* Address */}
      {order.address && (
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>{order.address.fullName}</p>
          <p>{order.address.phone}</p>
          <p>{order.address.addressLine1}</p>
          {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
          <p>
            {order.address.city}, {order.address.state} - {order.address.pincode}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-4 gap-4 border rounded px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium">Item:</span> {item.name}
              </div>
              <div>
                <span className="font-medium">Size:</span> {item.size}
              </div>
              <div>
                <span className="font-medium">Quantity:</span> {item.quantity}
              </div>
              <div className="text-right">
                <span className="font-medium">Price:</span>{" "}
                {formatRupees(item.price)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Status History */}
      {order.history && order.history.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Status History</h2>
          <ul className="space-y-2">
            {[...order.history]
              .sort(
                (a, b) =>
                  new Date(b.changedAt).getTime() -
                  new Date(a.changedAt).getTime()
              )
              .map((event) => (
                <li key={event.id} className="flex justify-between text-sm">
                  <StatusBadge status={event.status} />
                  <span className="text-gray-600">
                    {formatDateDDMMYYYY(event.changedAt)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Back button at bottom */}
      <div className="pt-6">
        <Link
          href="/admin"
          className="inline-block px-6 py-3 rounded-md border border-stone-300 bg-white hover:bg-stone-100 text-sm font-medium text-fashion-gold transition"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}