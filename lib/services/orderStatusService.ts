// fashion/lib/services/orderStatusService.ts
import { prisma } from "../prisma";
import { sendMail } from "../mailer";
import { orderStatusEmailCustomer } from "../emails/orderStatusEmailCustomer";
import { OrderEmailData } from "../types/OrderEmailData";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  // Update order and include relations defined in schema
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: { items: true, address: true },
  });

  // Log the status change in history
  await prisma.statusHistory.create({
    data: { status: newStatus, orderId },
  });

  // Adapt Prisma result into OrderEmailData
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
    const subject = `Order Status: ${newStatus.replace(/_/g, " ")}`;
    await sendMail({
      to: emailData.customer.email,
      subject,
      html,
    });
  }

  // Return updated order including history for API response
  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true, history: true },
  });

  return updatedOrder;
}