"use client"

import { useState } from "react"
import { formatRupees } from "@/lib/money"

interface OrderItem {
  id: string
  name: string
  size: string
  price: number
}

interface OrderData {
  id: string
  status: string
  amount: number
  createdAt: string
  items: OrderItem[]
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<OrderData | null>(null)

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setOrder(null)
    setLoading(true)

    const res = await fetch("/api/orders/track", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    orderId,
    phone,
  }),
})


    if (!res.ok) {
      setLoading(false)
      setError("Order not found or phone number mismatch")
      return
    }

    const data = await res.json()
    setOrder(data)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Track Your Order</h1>

      <form onSubmit={handleTrack} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Order ID"
          className="w-full border rounded px-3 py-2"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border rounded px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 font-semibold text-white
                  bg-gradient-to-r from-fashion-gold to-amber-500
                  hover:from-amber-500 hover:to-fashion-gold
                  shadow-md hover:shadow-xl
                  transform hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300"
        >
          {loading ? "Checking..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold">{order.status.replace(/_/g, " ")}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Items</p>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} Size: {item.size}</span>
                  <span>{formatRupees(item.price)}</span>

                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between border-t pt-3 font-medium">
            <span>Total</span>
            <span>{formatRupees(order.amount)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
