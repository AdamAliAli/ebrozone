// Shared by both lib/auth/cookies.ts (which needs next/headers, usable only
// in Route Handlers/Server Components/Server Actions) and proxy.ts (which
// runs in a separate execution phase and must not import next/headers).
// Must match the NestJS backend exactly — see apps/api/src/auth/auth.module.ts
// and apps/api/src/auth/services/auth.service.ts.
export const ACCESS_TOKEN_COOKIE = "ebz_access_token";
export const REFRESH_TOKEN_COOKIE = "ebz_refresh_token";
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
