import { NextResponse, NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/services/orderStatusService"; // central service
import { prisma } from "@/lib/prisma";

// PATCH
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
): Promise<Response> {
  try {
    const { orderId } = await context.params;
    const body = await req.json();
    const newStatus = body.status as OrderStatus;

    // Delegate to the service (handles DB update, history, email, subject line)
    const updatedOrder = await updateOrderStatus(orderId, newStatus);

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("ADMIN STATUS UPDATE ERROR", err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

// GET
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
): Promise<Response> {
  try {
    const { orderId } = await context.params;

    // GET should just fetch the order, no email sending
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, address: true, history: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("ADMIN ORDER FETCH ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}