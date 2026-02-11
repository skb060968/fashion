// fashion/app/api/admin/orders/[orderId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { orderStatusEmailCustomer } from "@/lib/emails/orderStatusEmailCustomer";
import { sendMail } from "@/lib/mailer";
import { OrderEmailData } from "@/lib/types/OrderEmailData";
import { OrderStatus } from "@prisma/client";

// PATCH: update order status, log the change in StatusHistory, and send email
export async function PATCH(
  req: Request,
  context: { params: { orderId: string } }
) {
  try {
    const { orderId } = context.params;
    const { status } = await req.json();

    // Ensure status is treated as enum
    const newStatus = status as OrderStatus;

    // Update the order's current status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { items: true, address: true }, // only valid relations
    });

    // Log the status change in history
    await prisma.statusHistory.create({
      data: { status: newStatus, orderId },
    });

    // Build email data for customer (customer info lives in Address)
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

    // Send status email to customer if email exists
    if (emailData.customer.email) {
      const html = orderStatusEmailCustomer(emailData);
      const subject = `Order ${order.id} status update: ${newStatus.replace(/_/g, " ")}`;
      await sendMail({
        to: emailData.customer.email,
        subject,
        html,
      });
    }

    // Return updated order including history
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, address: true, history: true },
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
  context: { params: { orderId: string } }
) {
  try {
    const { orderId } = context.params;

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
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}