import { CartItem } from "@/context/CartContext"

export type OrderStatus =
  | "UNDER_VERIFICATION"
  | "VERIFIED"
  | "REJECTED"

export interface Address {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  items: CartItem[]
  address: Address
  amount: number
  paymentMethod: "UPI_MANUAL"
  status: OrderStatus
  createdAt: string
}

/**
 * IMPORTANT:
 * This key must remain stable across the app.
 * Do not version it unless you migrate data.
 */
const STORAGE_KEY = "orders"

function readOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function createOrder(order: Order): void {
  const orders = readOrders()
  orders.push(order) // append safely
  writeOrders(orders)
}

export function getOrderById(id: string): Order | null {
  return readOrders().find(o => o.id === id) || null
}

export function getAllOrders(): Order[] {
  return readOrders()
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus
): void {
  const updated = readOrders().map(order =>
    order.id === id ? { ...order, status } : order
  )
  writeOrders(updated)
}
