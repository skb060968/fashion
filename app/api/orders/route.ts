import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import {
  orderPlacedEmailAdmin,
  orderPlacedEmailCustomer,
} from "@/lib/emails/orderPlaced";

// Helper: generate short order codes like 26001, 26002, etc.
async function generateOrderCode(year: number) {
  const yearSuffix = year.toString().slice(-2);

  const lastOrder = await prisma.order.findFirst({
    where: { orderCode: { startsWith: yearSuffix } },
    orderBy: { createdAt: "desc" },
  });

  const lastSeq = lastOrder
    ? parseInt(lastOrder.orderCode.slice(2)) // after YY
    : 0;

  const nextSeq = (lastSeq + 1).toString().padStart(3, "0");

  return `${yearSuffix}${nextSeq}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, address, amount, discount, paymentMethod } = body;

    if (!items || !address || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // 🔑 Generate orderCode
    const year = new Date().getFullYear();
    const orderCode = await generateOrderCode(year);

    // 1️⃣ Create order with relations + initial history
    const createdOrder = await prisma.order.create({
      data: {
        orderCode, // 👈 new short code
        amount,
        discount: discount ?? 0,
        paymentMethod: paymentMethod as PaymentMethod,
        status: OrderStatus.UNDER_VERIFICATION,

        address: {
          create: {
            fullName: address.fullName,
            phone: address.phone,
            email: address.email || null,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || null,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
        },

        items: {
          create: items.map((item: any) => ({
            name: item.name,
            slug: item.slug,
            size: item.size,
            price: item.price,
            quantity: item.quantity ?? 1,
            coverThumbnail: item.coverThumbnail,
          })),
        },

        history: {
          create: {
            status: OrderStatus.UNDER_VERIFICATION,
            changedAt: new Date(),
          },
        },
      },
    });

    // 2️⃣ Re-fetch order WITH relations
    const order = await prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: {
        address: true,
        items: true,
        history: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found after creation" },
        { status: 500 }
      );
    }

    // ✅ Return immediately to frontend
    const response = NextResponse.json(
      { success: true, orderId: order.orderCode }, // 👈 return short code
      { status: 201 }
    );

    // 🔔 Fire-and-forget email sending
    (async () => {
      try {
        // Admin notification
        if (process.env.ADMIN_EMAIL) {
          await sendMail({
            to: process.env.ADMIN_EMAIL,
            subject: "🛒 New order placed",
            html: orderPlacedEmailAdmin({
              orderCode: order.orderCode,
              amount: order.amount,
              discount: order.discount,
              status: order.status,
              createdAt: order.createdAt,
              paymentMethod: order.paymentMethod,
              customer: {
                fullName: order.address!.fullName,
                phone: order.address!.phone,
                email: order.address!.email ?? "",
                addressLine1: order.address!.addressLine1,
                addressLine2: order.address!.addressLine2 ?? "",
                city: order.address!.city,
                state: order.address!.state,
                pincode: order.address!.pincode,
              },
              items: order.items.map((item) => ({
                name: item.name,
                size: item.size,
                price: item.price,
                quantity: item.quantity,
                coverThumbnail: item.coverThumbnail ?? "",
              })),
            }),
          });
        }

        // Customer notification
        if (order.address?.email) {
          await sendMail({
            to: order.address.email,
            subject: "✅ Your order has been placed",
            html: orderPlacedEmailCustomer({
              orderCode: order.orderCode,
              amount: order.amount,
              discount: order.discount,
              status: order.status,
              createdAt: order.createdAt,
              paymentMethod: order.paymentMethod,
              customer: {
                fullName: order.address.fullName,
                phone: order.address.phone,
                email: order.address.email,
                addressLine1: order.address.addressLine1,
                addressLine2: order.address.addressLine2 ?? "",
                city: order.address.city,
                state: order.address.state,
                pincode: order.address.pincode,
              },
              items: order.items.map((item) => ({
                name: item.name,
                size: item.size,
                price: item.price,
                quantity: item.quantity,
                coverThumbnail: item.coverThumbnail ?? "",
              })),
            }),
          });
        }
      } catch (error) {
        console.error("ORDER_EMAIL_FAILED:", error);
      }
    })();

    return response;
  } catch (error) {
    console.error("ORDER_CREATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}