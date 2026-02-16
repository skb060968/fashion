import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST() {
  const headerList = await headers();
  const host = headerList.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";

  const url = `${protocol}://${host}/admin-login`;

  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: "admin_session",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return response;
}