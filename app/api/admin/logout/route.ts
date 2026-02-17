import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST() {
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";

  const redirectUrl = `${protocol}://${host}/admin-login`;

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: "admin_session",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
