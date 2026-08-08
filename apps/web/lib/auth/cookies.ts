import { cookies } from "next/headers";
import type { TokenPair } from "./types";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "./constants";

export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * Only callable from a Route Handler or Server Action — Next.js throws if
 * cookies are mutated during a Server Component render.
 */
export async function setAuthCookies(tokens: TokenPair): Promise<void> {
  const store = await cookies();
  store.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    cookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS),
  );
  store.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    cookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
  );
}

/**
 * Only callable from a Route Handler or Server Action — see setAuthCookies.
 */
export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}
