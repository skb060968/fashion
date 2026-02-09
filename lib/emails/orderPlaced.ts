import { formatRupees } from "@/lib/money";

type OrderEmailData = {
  id: string;
  amount: number;
  discount?: number;
  status: string;
  createdAt: Date;
  paymentMethod: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    name: string;
    size: string;
    price: number;
    quantity: number;
    coverThumbnail: string;
  }[];
};

// ✅ Admin email version
export function orderPlacedEmailAdmin(order: OrderEmailData) {
  const total = order.amount - (order.discount ?? 0);

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="margin-bottom: 12px; font-size:18px;">🛒 NEW ORDER RECEIVED</h2>
      <p>A new order has been placed successfully. Please verify payment status.</p>

      <p><strong>Order ID:</strong><br />${order.id}</p>
      <p><strong>Date:</strong><br />${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Amount:</strong><br />${formatRupees(order.amount)}</p>
      ${order.discount ? `<p><strong>Discount:</strong><br />-${formatRupees(order.discount)}</p>` : ""}
      <p><strong>Total:</strong><br />${formatRupees(total)}</p>
      <p><strong>Status:</strong><br />${order.status.replace(/_/g, " ")}</p>
      <p><strong>Payment Method:</strong><br />${order.paymentMethod}</p>

      <h3 style="margin-top:20px; font-size:16px;">Customer Details</h3>
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

      <br />
       <a
        href="${process.env.SITE_URL}"
        style="
          display: inline-block;
          padding: 10px 16px;
          background: #b35fbb;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
        "
      >
        Go to Admin Dashboard
      </a>

      <br /><br />
      <p style="color:#555;">GP Fashion</p>
    </div>
  `;
}

// ✅ Customer email version
export function orderPlacedEmailCustomer(order: OrderEmailData) {
  const total = order.amount - (order.discount ?? 0);

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="margin-bottom: 12px; font-size:18px;">✅ Your Order Has Been Placed</h2>
      <p>Thank you for shopping with GP Fashion! We’ve received your order and will keep you updated on its status.</p>

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