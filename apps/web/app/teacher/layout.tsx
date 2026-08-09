import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { getAccessToken } from "../../lib/auth/cookies";
import { decodeAccessToken } from "../../lib/auth/jwt";

// proxy.ts already guarantees only an authenticated TEACHER or
// ADMINISTRATOR reaches this layout — this is a defense-in-depth read,
// not the authorization boundary.
export default async function TeacherLayout({
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
    <DashboardShell role={payload.role} activeHref="/teacher">
      {children}
    </DashboardShell>
  );
}
