import { NextResponse, NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/services/orderStatusService";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function verifyAdmin(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;

  if (!session) return false;

  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update("admin-session")
    .digest("hex");

  return session === expected;
}

// GET
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await context.params; // ✅ IMPORTANT FIX

    const order = await prisma.order.findUnique({
      where: { orderCode: orderId },
      include: { items: true, address: true, history: true },
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

// PATCH
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await context.params; // ✅ IMPORTANT FIX
    const body = await req.json();
    const newStatus = body.status as OrderStatus;

    const updatedOrder = await updateOrderStatus(orderId, newStatus);

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("ADMIN STATUS UPDATE ERROR", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
