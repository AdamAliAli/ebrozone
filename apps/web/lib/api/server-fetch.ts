import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/cookies";

const API_URL = process.env.API_URL;

/**
 * Server-Component-safe authenticated GET against the NestJS API.
 *
 * Unlike lib/auth/api-fetch.ts's authFetch() (Route-Handler-only — its
 * 401 path calls setAuthCookies(), which throws during a Server Component
 * render), this never attempts to mutate cookies. proxy.ts is responsible
 * for keeping the access-token cookie fresh — including forwarding the
 * rotated value into the current request — before a protected page ever
 * renders. If a 401 still reaches here, there is no recoverable session;
 * redirect to /login rather than retrying or throwing.
 */
export async function serverFetch<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "API_URL is not configured. Set it in apps/web/.env.local.",
    );
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(
      `Request to ${path} failed with status ${response.status}.`,
    );
  }

  return (await response.json()) as T;
}
