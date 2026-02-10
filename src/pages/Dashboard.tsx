import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminDashboard from "@/pages/dashboards/SuperAdminDashboard";
import SchoolAdminDashboard from "@/pages/dashboards/SchoolAdminDashboard";
import TeacherDashboard from "@/pages/dashboards/TeacherDashboard";

export default function Dashboard() {
  const { role } = useAuth();

  const content = role === "super_admin" ? <SuperAdminDashboard />
    : role === "school_admin" ? <SchoolAdminDashboard />
    : <TeacherDashboard />;

  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
}
