import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { getAccessToken } from "../../lib/auth/cookies";
import { decodeAccessToken } from "../../lib/auth/jwt";

// proxy.ts already guarantees only an authenticated STUDENT (or a role it
// just refreshed into an authenticated state) reaches this layout — this
// is a defense-in-depth read, not the authorization boundary.
export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken = await getAccessToken();
  const payload = accessToken ? decodeAccessToken(accessToken) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <DashboardShell role={payload.role} activeHref="/student">
      {children}
    </DashboardShell>
  );
}
