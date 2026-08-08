import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "./cookies";
import type { TokenPair } from "./types";

const API_URL = process.env.API_URL;

function apiUrl(path: string): string {
  if (!API_URL) {
    throw new Error(
      "API_URL is not configured. Set it in apps/web/.env.local (see .env.example).",
    );
  }
  return `${API_URL}${path}`;
}

function withAuthHeader(init: RequestInit, accessToken: string | undefined): RequestInit {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return { ...init, headers, cache: "no-store" };
}

/**
 * Calls NestJS's POST /auth/refresh using the refresh-token cookie, and
 * rotates both httpOnly cookies on success. Only safe to call from a Route
 * Handler or Server Action (it writes cookies).
 *
 * Returns null when there is no refresh token, or the backend rejects it
 * (expired/invalid/already-used) — callers must treat that as "logged out"
 * and must NOT call this again for the same request (no retry loop).
 */
export async function refreshTokens(): Promise<TokenPair | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(apiUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const tokens = (await response.json()) as TokenPair;
  await setAuthCookies(tokens);
  return tokens;
}

/**
 * Authenticated server-side fetch against the NestJS API.
 *
 * - Reads the access-token cookie and sends it as `Authorization: Bearer`.
 * - On a 401, refreshes exactly once via the refresh-token cookie, rotates
 *   both cookies, and retries the original request exactly once.
 * - If refresh fails (no refresh token, or backend rejects it), clears both
 *   cookies and returns the original 401 response — never loops.
 *
 * Only safe to call from a Route Handler or Server Action (a failed-auth
 * path writes cookies via refreshTokens()/clearAuthCookies()).
 */
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = await getAccessToken();
  const firstAttempt = await fetch(apiUrl(path), withAuthHeader(init, accessToken));

  if (firstAttempt.status !== 401) {
    return firstAttempt;
  }

  const rotated = await refreshTokens();
  if (!rotated) {
    await clearAuthCookies();
    return firstAttempt;
  }

  return fetch(apiUrl(path), withAuthHeader(init, rotated.accessToken));
}
