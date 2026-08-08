import { NextResponse } from "next/server";
import { clearAuthCookies, getRefreshToken } from "../../../../lib/auth/cookies";

const API_URL = process.env.API_URL;

export async function POST(): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();

  if (API_URL && refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch {
      // Backend call failed (network error, etc). Cookies are cleared
      // below regardless — the browser must never be left holding a
      // session it believes is still valid.
    }
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true }, { status: 200 });
}
