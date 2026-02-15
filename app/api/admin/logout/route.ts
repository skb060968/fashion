import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });

  // Clear cookie on the response
  res.cookies.delete("admin_session");

  return res;
}