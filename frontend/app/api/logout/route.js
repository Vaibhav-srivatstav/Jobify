// File: app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ 
    success: true,
    message: "Logged out successfully" 
  });

  // This deletes the 'token' cookie from the browser
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Sets date to 1970 (instant expiry)
    path: "/",
  });

  return response;
}
