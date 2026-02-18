import { prisma } from "../prisma";
import { sendMail } from "../mailer";
import { orderStatusEmailCustomer } from "../emails/orderStatusEmailCustomer";
import { OrderEmailData } from "../types/OrderEmailData";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderCode: string, newStatus: OrderStatus) {
  // ✅ Update order by orderCode
  const order = await prisma.order.update({
    where: { orderCode },   // 👈 use boutique code
    data: { status: newStatus },
    include: { items: true, address: true },
  });

  // ✅ Log the status change in history (FK still uses internal id)
  await prisma.statusHistory.create({
    data: { status: newStatus, orderId: order.id },
  });

  // Adapt Prisma result into OrderEmailData
  const emailData: OrderEmailData = {
    orderCode: order.orderCode,   // 👈 expose boutique code
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

  // ✅ Send status email to customer if email exists
if (emailData.customer.email) {
  (async () => {
    try {
      const html = orderStatusEmailCustomer(emailData);
      const subject = `Order Status: ${newStatus.replace(/_/g, " ")}`;
      await sendMail({
        to: emailData.customer.email!, // 👈 non‑null assertion
        subject,
        html,
      });
    } catch (err) {
      console.error("STATUS_EMAIL_FAILED:", err);
    }
  })();
}

  // ✅ Return updated order including history for API response
  const updatedOrder = await prisma.order.findUnique({
    where: { orderCode },   // 👈 fetch by boutique code
    include: { items: true, address: true, history: true },
  });

  return updatedOrder;
}