import { NextResponse } from "next/server";
import { refreshTokens } from "../../../../lib/auth/api-fetch";
import { clearAuthCookies, getRefreshToken } from "../../../../lib/auth/cookies";

export async function POST(): Promise<NextResponse> {
  const existingRefreshToken = await getRefreshToken();
  if (!existingRefreshToken) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const rotated = await refreshTokens();
  if (!rotated) {
    await clearAuthCookies();
    return NextResponse.json({ message: "Session expired." }, { status: 401 });
  }

  // Rotated tokens were already written to httpOnly cookies by
  // refreshTokens() — this response body intentionally carries no token.
  return NextResponse.json({ ok: true }, { status: 200 });
}
