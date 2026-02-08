"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  slug: string
  name: string
  price: number
  coverThumbnail: string
  size: string
  quantity: number   // ✅ new field
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (slug: string, size: string) => void
  updateQuantity: (slug: string, size: string, qty: number) => void // ✅ new method
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart")
    if (stored) setCart(JSON.parse(stored))
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.slug === item.slug && i.size === item.size)
      if (existing) {
        return prev.map(i =>
          i.slug === item.slug && i.size === item.size
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeFromCart = (slug: string, size: string) => {
    setCart(prev =>
      prev.filter(i => !(i.slug === slug && i.size === size))
    )
  }

  const updateQuantity = (slug: string, size: string, qty: number) => {
    setCart(prev =>
      prev.map(i =>
        i.slug === slug && i.size === size ? { ...i, quantity: qty } : i
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}