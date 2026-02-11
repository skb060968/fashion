import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { orderStatusEmailCustomer } from "@/emails/orderStatusEmailCustomer";
import { sendOrderEmail } from "@/lib/mailer";
import { OrderEmailData } from "@/types/OrderEmailData";

// PATCH: update order status, log the change in StatusHistory, and send email
export async function PATCH(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const { status } = await req.json();

    // Update the order's current status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, address: true, customer: true },
    });

    // Log the status change in history
    await prisma.statusHistory.create({
      data: { status, orderId },
    });

    // Build email data for customer
    const emailData: OrderEmailData = {
      id: order.id,
      amount: order.amount,
      discount: order.discount ?? undefined,
      status,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      customer: {
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        email: order.customer.email ?? undefined,
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
      const subject = `Order ${order.id} status update: ${status.replace(/_/g, " ")}`;
      await sendOrderEmail(emailData.customer.email, subject, html);
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
  context: { params: Promise<{ orderId: string }> }
) {
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
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}