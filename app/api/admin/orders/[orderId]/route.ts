import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH: update order status and log the change in StatusHistory
export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { status } = await req.json();

    // Update the order's current status
    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    // Log the status change in history
    await prisma.statusHistory.create({
      data: {
        status,
        orderId: params.orderId,
      },
    });

    // Return the updated order including history
    const updatedOrder = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: true,
        address: true,
        history: true, // include status history
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
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: true,
        address: true,
        history: true, // include status history
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