import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    // ✅ unwrap the Promise
    const { orderId } = await context.params;

    // 🔑 lookup by orderCode instead of cuid id
    const order = await prisma.order.findUnique({
      where: { orderCode: orderId },
      include: {
        address: true,
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ FETCH ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}