// File: app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Get the token from the cookie (Next.js can see this!)
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { msg: "Not authorized, no token found" },
        { status: 401 }
      );
    }

    // 2. Call your External Backend (Render)
    // We manually attach the token as a header since we are doing a server-to-server call
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // <--- ATTACH TOKEN HERE
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // 3. Return the user data to your frontend component
    return NextResponse.json({
      success: true,
      user: data.user,
    });
    
  } catch (error) {
    console.error("Me API Error:", error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
