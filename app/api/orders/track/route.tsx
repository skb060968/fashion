import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { orderCode, phone } = await req.json()

    if (!orderCode || !phone) {
      return NextResponse.json(
        { error: "Missing order code or phone number" },
        { status: 400 }
      )
    }

    // ✅ Look up by orderCode instead of id
    const order = await prisma.order.findUnique({
      where: { orderCode },
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
      orderCode: order.orderCode, // 👈 return boutique code
      status: order.status,
      amount: order.amount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
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