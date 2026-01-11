import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const response = NextResponse.json({
        msg: "Google login successful",
        user: data.user
    });

    // Set Cookie for Google Login too
    response.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Server connection failed" }, { status: 500 });
  }
}
