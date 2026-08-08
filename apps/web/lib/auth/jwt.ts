import type { Role } from "./types";

const VALID_ROLES: readonly Role[] = ["STUDENT", "TEACHER", "ADMINISTRATOR"];

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  exp: number;
  iat: number;
}

/**
 * Decodes (does NOT verify the signature of) a JWT access token payload.
 *
 * This exists only for optimistic, UX-level routing decisions in proxy.ts —
 * e.g. "which role's home page should this user land on". NestJS is the
 * only party that verifies the token's signature and enforces real
 * authorization; nothing that reads this function's output is a security
 * boundary, and no code here should ever be treated as one.
 */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const [, payloadSegment] = token.split(".");
    if (!payloadSegment) {
      return null;
    }

    const json = Buffer.from(payloadSegment, "base64url").toString("utf8");
    const payload = JSON.parse(json) as Partial<AccessTokenPayload>;

    if (
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.exp !== "number" ||
      !VALID_ROLES.includes(payload.role as Role)
    ) {
      return null;
    }

    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(payload: AccessTokenPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}
