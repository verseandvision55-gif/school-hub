import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, UserCheck, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SchoolAdminDashboard() {
  const { profile, schoolId } = useAuth();
  const [stats, setStats] = useState({ teachers: 0, classes: 0, students: 0 });

  useEffect(() => {
    if (!schoolId) return;
    const fetchStats = async () => {
      const [classesRes, studentsRes] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact", head: true }).eq("school_id", schoolId),
        supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", schoolId),
      ]);
      setStats({
        teachers: 0,
        classes: classesRes.count || 0,
        students: studentsRes.count || 0,
      });
    };
    fetchStats();
  }, [schoolId]);

  const cards = [
    { title: "Teachers", value: stats.teachers, icon: UserCheck, color: "text-primary" },
    { title: "Classes", value: stats.classes, icon: BookOpen, color: "text-accent" },
    { title: "Students", value: stats.students, icon: Users, color: "text-secondary" },
    { title: "Attendance Rate", value: "–", icon: GraduationCap, color: "text-info" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">School Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome, {profile?.full_name || "Admin"}. Manage your school operations.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
