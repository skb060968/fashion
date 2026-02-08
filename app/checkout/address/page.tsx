"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type AddressForm = {
  fullName: string
  phone: string
  email: string        // ✅ new field
  addressLine1: string
  city: string
  state: string
  pincode: string
}

export default function AddressPage() {
  const router = useRouter()

  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    email: "",          // ✅ initialize
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleContinue = () => {
    const hasEmptyField = Object.values(form).some(
      value => value.trim() === ""
    )

    if (hasEmptyField) {
      setError("Please fill in all address details before continuing.")
      return
    }

    // ✅ SINGLE SOURCE OF TRUTH
    localStorage.setItem("checkout_address", JSON.stringify(form))

    router.push("/checkout/payment")
  }

  return (
    <section className="bg-stone-50 pt-24 pb-20">
      <div className="container-max max-w-3xl">
        <h1 className="font-serif text-3xl font-bold mb-10">
          Shipping Address
        </h1>

        <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
          />

          {/* ✅ New Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
          />

          <textarea
            name="addressLine1"
            placeholder="Address (House no, Street, Area)"
            rows={3}
            value={form.addressLine1}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
            />
          </div>

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-fashion-gold"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
          <Link
            href="/cart"
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center
              px-10 py-4 rounded-full
              border-2 border-fashion-gold
              text-fashion-gold font-semibold
              transition-all
              hover:bg-fashion-gold hover:text-white hover:shadow-xl
            "
          >
            ← Back to Cart
          </Link>

          <button
            onClick={handleContinue}
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center
              px-10 py-4 rounded-full
              border-2 border-fashion-gold
              text-fashion-gold font-semibold
              transition-all
              hover:bg-fashion-gold hover:text-white hover:shadow-xl
            "
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </section>
  )
}