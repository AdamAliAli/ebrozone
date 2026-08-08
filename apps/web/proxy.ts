import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./lib/auth/constants";
import { decodeAccessToken, isAccessTokenExpired } from "./lib/auth/jwt";
import type { AccessTokenPayload } from "./lib/auth/jwt";
import type { Role } from "./lib/auth/types";

// UX/navigation layer only. NestJS remains the sole authorization
// boundary — every one of these role checks is re-verified server-side
// on every real API call regardless of what happens here.
const ROLE_HOME: Record<Role, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  ADMINISTRATOR: "/admin",
};

function isAllowed(pathname: string, role: Role): boolean {
  if (pathname.startsWith("/student")) {
    return role === "STUDENT";
  }
  if (pathname.startsWith("/teacher")) {
    // Mirrors the backend's own allow-list (e.g. GET /dashboard/teacher
    // accepts TEACHER or ADMINISTRATOR) — not an invented permission.
    return role === "TEACHER" || role === "ADMINISTRATOR";
  }
  if (pathname.startsWith("/admin")) {
    return role === "ADMINISTRATOR";
  }
  return true;
}

function extractCookieValue(
  setCookieHeaders: string[],
  name: string,
): string | undefined {
  for (const header of setCookieHeaders) {
    if (header.startsWith(`${name}=`)) {
      return header.slice(name.length + 1).split(";")[0];
    }
  }
  return undefined;
}

/**
 * Rebuilds the request's Cookie header with the rotated access/refresh
 * token values substituted in, preserving every other cookie untouched.
 * Set-Cookie headers on the *response* only update what the browser sends
 * on its *next* request — without this, a Server Component rendering the
 * *current* request would still read the just-expired access token via
 * next/headers cookies() and 401 against NestJS again.
 */
function buildForwardedCookieHeader(
  request: NextRequest,
  rotatedSetCookies: string[],
): string {
  const cookieMap = new Map<string, string>();
  for (const cookie of request.cookies.getAll()) {
    cookieMap.set(cookie.name, cookie.value);
  }
  for (const name of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]) {
    const rotatedValue = extractCookieValue(rotatedSetCookies, name);
    if (rotatedValue) {
      cookieMap.set(name, rotatedValue);
    }
  }
  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const loginUrl = new URL("/login", request.url);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  let payload: AccessTokenPayload | null = accessToken
    ? decodeAccessToken(accessToken)
    : null;
  let rotatedSetCookies: string[] = [];

  if (!payload || isAccessTokenExpired(payload)) {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.redirect(loginUrl);
    }

    // Reuses the existing refresh implementation (lib/auth/api-fetch.ts's
    // refreshTokens(), via the already-verified /api/auth/refresh route)
    // rather than re-implementing rotation here.
    const refreshResponse = await fetch(
      new URL("/api/auth/refresh", request.url),
      {
        method: "POST",
        headers: { cookie: request.headers.get("cookie") ?? "" },
      },
    );

    if (!refreshResponse.ok) {
      const redirect = NextResponse.redirect(loginUrl);
      for (const setCookie of refreshResponse.headers.getSetCookie()) {
        redirect.headers.append("set-cookie", setCookie);
      }
      return redirect;
    }

    rotatedSetCookies = refreshResponse.headers.getSetCookie();
    const newAccessToken = extractCookieValue(
      rotatedSetCookies,
      ACCESS_TOKEN_COOKIE,
    );
    payload = newAccessToken ? decodeAccessToken(newAccessToken) : null;

    if (!payload) {
      return NextResponse.redirect(loginUrl);
    }
  }

  if (!isAllowed(request.nextUrl.pathname, payload.role)) {
    const redirect = NextResponse.redirect(
      new URL(ROLE_HOME[payload.role], request.url),
    );
    for (const setCookie of rotatedSetCookies) {
      redirect.headers.append("set-cookie", setCookie);
    }
    return redirect;
  }

  const requestHeaders = new Headers(request.headers);
  if (rotatedSetCookies.length > 0) {
    requestHeaders.set(
      "cookie",
      buildForwardedCookieHeader(request, rotatedSetCookies),
    );
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  for (const setCookie of rotatedSetCookies) {
    response.headers.append("set-cookie", setCookie);
  }
  return response;
}

export const config = {
  matcher: [
    "/student",
    "/student/:path*",
    "/teacher",
    "/teacher/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
