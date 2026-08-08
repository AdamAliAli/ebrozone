import { NextResponse } from "next/server";
import { setAuthCookies } from "../../../../lib/auth/cookies";
import type {
  LoginRequestBody,
  SessionUser,
  TokenPair,
} from "../../../../lib/auth/types";

const API_URL = process.env.API_URL;

export async function POST(request: Request): Promise<NextResponse> {
  if (!API_URL) {
    return NextResponse.json(
      { message: "Server misconfiguration." },
      { status: 500 },
    );
  }

  let body: LoginRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: "no-store",
  });

  if (!loginResponse.ok) {
    const errorBody = await loginResponse.json().catch(() => ({}));
    return NextResponse.json(
      { message: errorBody.message ?? "Login failed." },
      { status: loginResponse.status },
    );
  }

  const tokens = (await loginResponse.json()) as TokenPair;

  // Tokens are written straight to httpOnly cookies and never included in
  // this handler's JSON response — the browser's JS never sees them.
  await setAuthCookies(tokens);

  const meResponse = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
    cache: "no-store",
  });

  if (!meResponse.ok) {
    return NextResponse.json(
      { message: "Login succeeded but session lookup failed." },
      { status: 502 },
    );
  }

  const user = (await meResponse.json()) as SessionUser;
  return NextResponse.json({ user }, { status: 200 });
}
