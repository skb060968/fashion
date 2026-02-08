import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// updated new file
// PATCH: update order status and log the change in StatusHistory
export async function PATCH(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;   // ✅ unwrap the Promise
    const { status } = await req.json();

    // Update the order's current status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Log the status change in history
    await prisma.statusHistory.create({
      data: {
        status,
        orderId,
      },
    });

    // Return the updated order including history
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        address: true,
        history: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("ADMIN STATUS UPDATE ERROR", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

// GET: fetch order details including items, address, and history
export async function GET(
  _req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;   // ✅ unwrap the Promise

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        address: true,
        history: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("ADMIN ORDER FETCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}