// /src/emails/orderStatusEmailCustomer.ts
import { formatRupees } from "@/lib/money";
import { OrderEmailData } from "../types/OrderEmailData";

export function orderStatusEmailCustomer(order: OrderEmailData) {
  const total = order.amount - (order.discount ?? 0);

  const headerMap: Record<string, string> = {
    UNDER_VERIFICATION: "✅ Order Under Verification",
    VERIFIED: "✅ Payment Verified",
    REJECTED: "❌ Payment Rejected",
    PROCESSING: "🛠️ Order Processing",
    SHIPPED: "📦 Order Shipped",
    DELIVERED: "🎉 Order Delivered",
    CANCELLED: "⚠️ Order Cancelled",
    REFUNDED: "💸 Refund Processed",
  };

  const messageMap: Record<string, string> = {
    UNDER_VERIFICATION: `We’ve received your order #${order.id}. Payment is under verification.`,
    VERIFIED: `Your payment for order #${order.id} has been verified. We’re preparing your order.`,
    REJECTED: `Unfortunately, your payment for order #${order.id} could not be verified.`,
    PROCESSING: `Your order #${order.id} is being prepared.`,
    SHIPPED: `Order #${order.id} has been shipped. Track your package soon.`,
    DELIVERED: `Order #${order.id} has been delivered successfully.`,
    CANCELLED: `Order #${order.id} has been cancelled.`,
    REFUNDED: `Your refund for order #${order.id} has been processed.`,
  };

  const header = headerMap[order.status] || "ℹ️ Order Update";
  const message = messageMap[order.status] || `Order #${order.id} status changed to ${order.status}.`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="margin-bottom: 12px; font-size:18px;">${header}</h2>
      <p>${message}</p>

      <p><strong>Order ID:</strong><br />${order.id}</p>
      <p><strong>Date:</strong><br />${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Amount:</strong><br />${formatRupees(order.amount)}</p>
      ${order.discount ? `<p><strong>Discount:</strong><br />-${formatRupees(order.discount)}</p>` : ""}
      <p><strong>Total:</strong><br />${formatRupees(total)}</p>
      <p><strong>Status:</strong><br />${order.status.replace(/_/g, " ")}</p>
      <p><strong>Payment Method:</strong><br />${order.paymentMethod}</p>

      <h3 style="margin-top:20px; font-size:16px;">Shipping To</h3>
      <p>
        ${order.customer.fullName}<br />
        ${order.customer.phone}<br />
        ${order.customer.email ? order.customer.email + "<br />" : ""}
        ${order.customer.addressLine1}${order.customer.addressLine2 ? ", " + order.customer.addressLine2 : ""}<br />
        ${order.customer.city}, ${order.customer.state} – ${order.customer.pincode}
      </p>

      <h3 style="margin-top:20px; font-size:16px;">Order Items</h3>
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th align="left" style="border-bottom:1px solid #ccc; padding:6px;">Item</th>
            <th align="left" style="border-bottom:1px solid #ccc; padding:6px;">Size</th>
            <th align="left" style="border-bottom:1px solid #ccc; padding:6px;">Qty</th>
            <th align="left" style="border-bottom:1px solid #ccc; padding:6px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding:6px;">${item.name}</td>
              <td style="padding:6px;">${item.size}</td>
              <td style="padding:6px;">${item.quantity}</td>
              <td style="padding:6px;">${formatRupees(item.price)}</td>
            </tr>`).join("")}
        </tbody>
      </table>

      <br /><br />
      <p style="color:#555;">GP Fashion</p>
    </div>
  `;
}