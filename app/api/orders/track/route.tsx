import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { orderId, phone } = await req.json()

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Missing order ID or phone number" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        items: true,
      },
    })

    if (!order || !order.address) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // 🔐 Ownership check
    if (order.address.phone !== phone) {
      return NextResponse.json(
        { error: "Invalid order details" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      amount: order.amount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity, // ✅ now included
      })),
    })
  } catch (error) {
    console.error("TRACK ORDER ERROR:", error)
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    )
  }
}