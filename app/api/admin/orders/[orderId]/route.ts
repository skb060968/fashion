import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { orderStatusEmailCustomer } from "@/lib/emails/orderStatusEmailCustomer";
import { sendMail } from "@/lib/mailer";
import { OrderEmailData } from "@/lib/types/OrderEmailData";
import { OrderStatus } from "@prisma/client";

// PATCH
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
): Promise<Response> {
  try {
    const { orderId } = await context.params;
    const body = await req.json();
    const newStatus = body.status as OrderStatus;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { items: true, address: true },
    });

    await prisma.statusHistory.create({
      data: { status: newStatus, orderId },
    });

    const emailData: OrderEmailData = {
      id: order.id,
      amount: order.amount,
      discount: order.discount ?? undefined,
      status: newStatus,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      customer: {
        fullName: order.address?.fullName ?? "",
        phone: order.address?.phone ?? "",
        email: order.address?.email ?? undefined,
        addressLine1: order.address?.addressLine1 ?? "",
        addressLine2: order.address?.addressLine2 ?? undefined,
        city: order.address?.city ?? "",
        state: order.address?.state ?? "",
        pincode: order.address?.pincode ?? "",
      },
      items: order.items.map(i => ({
        name: i.name,
        size: i.size,
        price: i.price,
        quantity: i.quantity,
        coverThumbnail: i.coverThumbnail,
      })),
    };

    if (emailData.customer.email) {
      const html = orderStatusEmailCustomer(emailData);
      const subject = `Order ${order.id} status update: ${newStatus.replace(/_/g, " ")}`;
      await sendMail({
        to: emailData.customer.email,
        subject,
        html,
      });
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, address: true, history: true },
    });

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