import Link from "next/link";
import { cn } from "../../lib/utils";
import type { NavItem } from "./nav-items";

interface SidebarProps {
  items: NavItem[];
  activeHref: string;
  ariaLabel: string;
  className?: string;
}

// Shared across Student/Teacher/Admin dashboards — purely presentational,
// the nav item list and its aria-label are supplied by the caller
// (see DashboardShell, which picks the right list based on role).
export function Sidebar({ items, activeHref, ariaLabel, className }: SidebarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "w-64 shrink-0 flex-col gap-1 border-r border-border bg-background p-4",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.href === activeHref;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-small font-medium transition-colors duration-[var(--duration-fast)]",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon size={20} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
