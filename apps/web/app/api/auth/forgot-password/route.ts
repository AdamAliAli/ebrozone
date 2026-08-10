import { NextResponse } from "next/server";
import type { ForgotPasswordRequestBody } from "../../../../lib/auth/types";

const API_URL = process.env.API_URL;

// Proxies to NestJS POST /auth/forgot-password, which always resolves
// without revealing whether the email belongs to an account (prevents
// user enumeration) — this handler mirrors that by always returning a
// generic success response regardless of the backend's outcome.
export async function POST(request: Request): Promise<NextResponse> {
  if (!API_URL) {
    return NextResponse.json(
      { message: "Server misconfiguration." },
      { status: 500 },
    );
  }

  let body: ForgotPasswordRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email }),
    cache: "no-store",
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
