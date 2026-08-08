import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "./logout-button";

interface TopNavProps {
  role: string;
  menuButton?: ReactNode;
}

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

// Shared across Student/Teacher/Admin dashboards — "Top Navigation" with
// Logo + Profile Menu appears in all three docs. Search and Notifications
// are intentionally omitted for V1: there is no backend for either yet,
// and a control that does nothing is worse than no control.
export function TopNav({ role, menuButton }: TopNavProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {menuButton}
        <Link href="/" className="flex items-center" aria-label="EbroZone home">
          <Image
            src="/logo.png"
            alt="EbroZone"
            width={120}
            height={38}
            style={{ height: "auto" }}
          />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-small text-muted-foreground sm:inline">
          {formatRole(role)}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
