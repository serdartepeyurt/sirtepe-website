import { NextResponse } from "next/server";
import { GoogleAuthProvider } from "@/lib/auth/GoogleAuthProvider";

export async function GET() {
  const authProvider = new GoogleAuthProvider();
  const url = authProvider.getAuthUrl();
  return NextResponse.redirect(url);
}
