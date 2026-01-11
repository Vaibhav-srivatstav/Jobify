import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ msg: "Logged out" });
  
  // Delete the cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry to past date
    path: "/",
  });

  return response;
}
