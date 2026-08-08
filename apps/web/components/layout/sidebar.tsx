import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// docs/product-design/student-dashboard/03-wireframe.md's Sidebar list.
// Only "Dashboard" is a built page for V1 — the rest link to their
// expected future routes (same precedent as the login page's "Forgot
// password?" link, which also points at a not-yet-built page).
const STUDENT_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Calendar", href: "/student/calendar", icon: Calendar },
  { label: "Homework", href: "/student/homework", icon: ClipboardList },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "Messages", href: "/student/messages", icon: MessageSquare },
  { label: "Profile", href: "/student/profile", icon: User },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

interface SidebarProps {
  activeHref: string;
  className?: string;
}

export function Sidebar({ activeHref, className }: SidebarProps) {
  return (
    <nav
      aria-label="Student navigation"
      className={cn(
        "w-64 shrink-0 flex-col gap-1 border-r border-border bg-background p-4",
        className,
      )}
    >
      {STUDENT_NAV_ITEMS.map((item) => {
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
