import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 1. Forward request to External Backend
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // 2. Create Response
    const response = NextResponse.json({
        msg: "Login successful",
        user: data.user
    });

    // 3. SET COOKIE (This is the magic part)
    // Because Next.js sets it, it belongs to Localhost/Vercel
    response.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Server connection failed" }, { status: 500 });
  }
}
