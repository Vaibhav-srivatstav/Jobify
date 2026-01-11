// File: app/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Send credentials to your External Backend (Render)
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { msg: data.msg || "Login failed" },
        { status: backendRes.status }
      );
    }

    // 2. Create the response
    const response = NextResponse.json({
      msg: "Login successful",
      user: data.user,
    });

    // 3. SET THE COOKIE HERE (Securely on Frontend Domain)
    // This makes it visible to your Middleware
    response.cookies.set("token", data.token, {
      httpOnly: true, // Javascript cannot read it
      secure: process.env.NODE_ENV === "production", // Secure in Prod, works in Localhost
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
