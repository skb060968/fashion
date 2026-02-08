"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { formatRupees } from "@/lib/money"

type Order = {
  id: string
  amount: number
  paymentMethod: string
  status: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-gray-600 text-lg"
        aria-live="polite"
      >
        Loading order confirmation…
      </div>
    )
  }

  if (!order) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-red-600 text-lg"
        aria-live="polite"
      >
        No order found.
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl border-2 border-fashion-gold p-8 max-w-md w-full text-center space-y-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">
          Order Confirmed 🎉
        </h1>

        <div className="text-lg text-gray-800 space-y-3 text-left">
          <p>
            <span className="font-medium">Order ID :</span>{" "}
            <span className="font-mono">{order.id}</span>
          </p>
          <p>
            <span className="font-medium">Status :</span> {order.status}
          </p>
          <p>
            <span className="font-medium">Amount :</span>{" "}
            {formatRupees(order.amount)}
          </p>
          <p>
            <span className="font-medium">Payment Method :</span>{" "}
            {order.paymentMethod}
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href={`/invoice/${order.id}`}
            className="w-full border border-gray-300 rounded-lg py-3 text-base text-gray-800 hover:bg-gray-100 transition"
          >
            Download Invoice
          </Link>

          <Link
            href="/shop"
            className="w-full border border-gray-200 rounded-lg py-3 text-base text-gray-700 hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  )
}