import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, UserCheck, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SuperAdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ schools: 0, users: 0, activeSchools: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [schoolsRes, activeRes] = await Promise.all([
        supabase.from("schools").select("id", { count: "exact", head: true }),
        supabase.from("schools").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      setStats({
        schools: schoolsRes.count || 0,
        users: 0,
        activeSchools: activeRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Schools", value: stats.schools, icon: School, color: "text-primary" },
    { title: "Active Schools", value: stats.activeSchools, icon: UserCheck, color: "text-accent" },
    { title: "Total Users", value: stats.users, icon: Users, color: "text-secondary" },
    { title: "Reports", value: "–", icon: BarChart3, color: "text-info" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Welcome back, {profile?.full_name || "Admin"}</h1>
        <p className="mt-1 text-muted-foreground">Here's what's happening across your platform.</p>
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
