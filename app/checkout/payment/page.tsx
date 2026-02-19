"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { formatRupees } from "@/lib/money"

type Address = {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export default function PaymentPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()

  const [address, setAddress] = useState<Address | null>(null)
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountRate = 0.1
  const discountAmount = totalAmount * discountRate
  const orderTotal = totalAmount - discountAmount

  useEffect(() => {
    const storedAddress = localStorage.getItem("checkout_address")
    if (!storedAddress) return
    setAddress(JSON.parse(storedAddress))
  }, [])

  const handlePlaceOrder = async () => {
    if (!address || cart.length === 0 || !confirmChecked) return
    try {
      setIsPlacingOrder(true)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          address,
          amount: orderTotal,
          discount: discountAmount,
          paymentMethod: "UPI_MANUAL",
        }),
      })
      if (!res.ok) throw new Error("Order creation failed")
      const data = await res.json()
      clearCart()
      localStorage.removeItem("checkout_address")
      router.push(`/checkout/success?orderId=${data.orderId}`)
      // ✅ keep isPlacingOrder true until navigation
    } catch (err) {
      alert("Something went wrong while placing your order.")
      setIsPlacingOrder(false) // only reset on error
    }
  }

  if (!address) return null

  return (
    <section className="bg-stone-50 pt-28 pb-16">
      <div className="mx-auto max-w-3xl space-y-8 px-4">
        <h1 className="font-serif text-3xl font-bold">Payment</h1>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="font-semibold text-lg">Order Items</h2>

          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white rounded-xl shadow-sm p-4 border-b last:border-none"
            >
              <div className="flex items-start gap-4">
              <Image
  src={item.coverThumbnail}
  alt={item.name}
  width={75}
  height={100}
  className="rounded-md object-cover sm:w-[150px] sm:h-[200px]"
  
/>
                <div>
                  <p className="font-serif text-lg font-semibold text-fashion-black">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">
                    Unit Price: {formatRupees(item.price)}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>

              <div className="mt-2 sm:mt-0 sm:text-right font-medium text-fashion-black self-end">
                Line Total: {formatRupees(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-lg">Shipping To</h2>
            <button
              onClick={() => router.push("/checkout/address")}
              className="text-sm text-fashion-gold hover:underline"
            >
              Change
            </button>
          </div>
          <p className="font-medium">{address.fullName}</p>
          <p className="text-sm text-gray-700">{address.phone}</p>
          <p className="text-sm text-gray-700">{address.email}</p>
          <p className="text-sm text-gray-700">
            {address.addressLine1}
            {address.addressLine2 && `, ${address.addressLine2}`}
          </p>
          <p className="text-sm text-gray-700">
            {address.city}, {address.state} – {address.pincode}
          </p>
        </div>

        {/* Amount Summary */}
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Total Amount</span>
            <span className="font-semibold">{formatRupees(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount ({discountRate * 100}%)</span>
            <span>-{formatRupees(discountAmount)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-fashion-black">
            <span>Order Total</span>
            <span>{formatRupees(orderTotal)}</span>
          </div>
        </div>

        {/* UPI */}
        <div className="bg-white rounded-xl shadow p-6 text-center space-y-4">
          <h2 className="font-semibold text-lg">Pay via UPI</h2>
        <Image
  src="/payments/upi.jpg"
  alt="UPI QR Code"
  width={220}
  height={220}
  className="mx-auto object-contain"
  
/>
          <label className="flex items-center justify-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
            />
            I confirm the order details are correct and I have completed the UPI payment.
          </label>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          disabled={!confirmChecked || isPlacingOrder}
          className="w-full py-4 rounded-full bg-fashion-gold text-white font-medium hover:bg-fashion-gold/90 transition disabled:opacity-50"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </section>
  )
}