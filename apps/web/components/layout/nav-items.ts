import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  User,
  Settings,
  Users,
  FolderOpen,
  BarChart3,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// docs/product-design/student-dashboard/03-wireframe.md's Sidebar list.
// Only "Dashboard" is a built page for V1 — the rest link to their
// expected future routes (same precedent as the login page's "Forgot
// password?" link, which also points at a not-yet-built page).
export const STUDENT_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Calendar", href: "/student/calendar", icon: Calendar },
  { label: "Homework", href: "/student/homework", icon: ClipboardList },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "Messages", href: "/student/messages", icon: MessageSquare },
  { label: "Profile", href: "/student/profile", icon: User },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

// docs/product-design/teacher-dashboard/03-wireframe.md's Sidebar list.
// Only "Dashboard" is a built page for V1 — same precedent as above.
export const TEACHER_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "Students", href: "/teacher/students", icon: Users },
  { label: "Schedule", href: "/teacher/schedule", icon: Calendar },
  { label: "Courses", href: "/teacher/courses", icon: BookOpen },
  { label: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
  { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
  { label: "Resources", href: "/teacher/resources", icon: FolderOpen },
  { label: "Reports", href: "/teacher/reports", icon: BarChart3 },
  { label: "Settings", href: "/teacher/settings", icon: Settings },
];

// docs/product-design/admin-dashboard/03-wireframe.md's Sidebar list.
// Only "Dashboard" is a built page for V1 — same precedent as above.
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Consultations", href: "/admin/consultations", icon: ClipboardList },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
