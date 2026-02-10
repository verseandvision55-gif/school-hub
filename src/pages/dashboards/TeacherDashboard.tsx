import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, UserCheck, BarChart3 } from "lucide-react";

export default function TeacherDashboard() {
  const { profile } = useAuth();

  const cards = [
    { title: "My Classes", value: 0, icon: BookOpen, color: "text-primary" },
    { title: "Total Students", value: 0, icon: Users, color: "text-accent" },
    { title: "Attendance Today", value: "–", icon: UserCheck, color: "text-secondary" },
    { title: "Avg. Performance", value: "–", icon: BarChart3, color: "text-info" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Teacher Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome, {profile?.full_name || "Teacher"}. Here's your class overview.</p>
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
