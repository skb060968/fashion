import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Build a redirect back to the login page
  const res = NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });

  // Clear the cookie on the response
  res.cookies.delete("admin_session");

  return res;
}