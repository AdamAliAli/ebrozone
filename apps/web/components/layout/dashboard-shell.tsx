"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { TopNav } from "./top-nav";
import { Sidebar } from "./sidebar";
import { Button } from "../ui/button";
import {
  STUDENT_NAV_ITEMS,
  TEACHER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  type NavItem,
} from "./nav-items";

interface DashboardShellProps {
  role: string;
  activeHref: string;
  children: ReactNode;
}

// Keyed by path, not role: an ADMINISTRATOR can reach /teacher (the
// backend allows ADMINISTRATOR on GET /dashboard/teacher) and should see
// the Teacher nav there, but the Admin nav on /admin.
const NAV_ITEMS_BY_PATH_PREFIX: [string, NavItem[]][] = [
  ["/admin", ADMIN_NAV_ITEMS],
  ["/teacher", TEACHER_NAV_ITEMS],
  ["/student", STUDENT_NAV_ITEMS],
];

function getNavItems(activeHref: string): NavItem[] {
  const match = NAV_ITEMS_BY_PATH_PREFIX.find(([prefix]) =>
    activeHref.startsWith(prefix),
  );
  return match ? match[1] : STUDENT_NAV_ITEMS;
}

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

// Shared shell across Student/Teacher/Admin dashboards — the
// TopNav+Sidebar composition described in every dashboard wireframe.
// Only the mobile sidebar open/closed toggle needs client state; the
// nav content itself stays a plain Server Component.
export function DashboardShell({ role, activeHref, children }: DashboardShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navItems = getNavItems(activeHref);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav
        role={role}
        menuButton={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            {isMobileNavOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </Button>
        }
      />
      <div className="relative flex flex-1">
        <Sidebar
          items={navItems}
          activeHref={activeHref}
          ariaLabel={`${formatRole(role)} navigation`}
          className={
            isMobileNavOpen
              ? "absolute z-20 flex h-[calc(100vh-4rem)] bg-background lg:static lg:flex"
              : "hidden lg:flex"
          }
        />
        <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
