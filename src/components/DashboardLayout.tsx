import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap, LayoutDashboard, School, Users, BookOpen,
  UserCheck, BarChart3, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const superAdminLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/schools", icon: School, label: "Schools" },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
];

const schoolAdminLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/teachers", icon: UserCheck, label: "Teachers" },
  { to: "/dashboard/classes", icon: BookOpen, label: "Classes" },
  { to: "/dashboard/students", icon: Users, label: "Students" },
];

const teacherLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/my-classes", icon: BookOpen, label: "My Classes" },
  { to: "/dashboard/attendance", icon: UserCheck, label: "Attendance" },
  { to: "/dashboard/grades", icon: BarChart3, label: "Grades" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = role === "super_admin" ? superAdminLinks
    : role === "school_admin" ? schoolAdminLinks
    : teacherLinks;

  const roleLabel = role === "super_admin" ? "Super Admin"
    : role === "school_admin" ? "School Admin"
    : "Teacher";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading text-lg font-bold text-sidebar-foreground">EduManage</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
              <p className="text-sm font-medium text-sidebar-foreground">{profile?.full_name || "User"}</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-3">Sign out</span>}
          </Button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-[68px]" : "ml-64"
      )}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
