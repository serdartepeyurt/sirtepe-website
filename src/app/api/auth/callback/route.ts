import { NextRequest, NextResponse } from "next/server";
import { GoogleAuthProvider } from "@/lib/auth/GoogleAuthProvider";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const authProvider = new GoogleAuthProvider();

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || "https://serdartepeyurt.com/api/auth/callback",
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 400 });
  }

  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;

  // Get user info
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userResponse.ok) {
    return NextResponse.json({ error: "Failed to get user info" }, { status: 400 });
  }

  const userInfo = await userResponse.json();

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({
    id: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(process.env.GOOGLE_REDIRECT_URI || "https://serdartepeyurt.com").origin;
  return NextResponse.redirect(new URL("/admin", siteUrl));
}
