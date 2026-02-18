"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatRupees } from "@/lib/money"

export default function PaymentPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  const [method, setMethod] = useState<"cod" | "upi">("cod")
  const [loading, setLoading] = useState(false)
  const [upiConfirmed, setUpiConfirmed] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)

  const confirmOrder = () => {
    if (method === "upi" && !upiConfirmed) return

    setLoading(true)
    setTimeout(() => {
      clearCart()
      router.push("/checkout/success")
    }, 700)
  }

  if (cart.length === 0) {
    return (
      <section className="bg-stone-50 pt-24 pb-16 text-center">
        <h1 className="font-serif text-3xl mb-4">No items to pay for</h1>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2
              border-2 border-fashion-gold text-fashion-gold
              px-10 py-4 rounded-full font-semibold
              transition-all hover:bg-fashion-gold hover:text-white hover:shadow-xl"
        >
          Back to shop
        </Link>
      </section>
    )
  }

  return (
    <section className="bg-stone-50 pt-24 pb-16">
      <div className="container-max max-w-2xl">
        <h1 className="font-serif text-3xl mb-10">Payment</h1>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>{formatRupees(subtotal)}</span>
          </div>
        </div>

        {/* Methods */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm space-y-5">
          <h2 className="text-lg font-medium">Payment Method</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
            />
            <span>Cash on Delivery</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={method === "upi"}
              onChange={() => setMethod("upi")}
            />
            <span>UPI QR Payment</span>
          </label>

          {method === "upi" && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-stone-50 p-6 text-center space-y-4">
            <Image
  src="/payments/upi-qr.jpg"
  alt="UPI QR"
  width={176}   // matches w-44 (44 * 4 = 176px)
  height={176}  // matches h-44
  className="mx-auto object-contain"
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         176px"
/>

              <p className="text-sm text-gray-600">
                Pay ₹{subtotal} using any UPI app
              </p>

              <label className="flex items-center justify-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={upiConfirmed}
                  onChange={e => setUpiConfirmed(e.target.checked)}
                />
                I confirm that I have completed the UPI payment
              </label>

              <p className="text-xs text-gray-500">
                Orders are verified manually before processing
              </p>
            </div>
          )}
        </div>

        <button
          onClick={confirmOrder}
          disabled={loading || (method === "upi" && !upiConfirmed)}
          className="w-full py-4 rounded-full bg-fashion-gold text-white font-medium hover:bg-fashion-gold/90 transition disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : method === "upi"
            ? "Confirm Payment"
            : "Place Order"}
        </button>

        <Link
          href="/checkout/address"
          className="inline-flex items-center gap-2
              border-2 border-fashion-gold text-fashion-gold
              px-10 py-4 rounded-full font-semibold
              transition-all hover:bg-fashion-gold hover:text-white hover:shadow-xl"
        >
          ← Back to Address
        </Link>
      </div>
    </section>
  )
}