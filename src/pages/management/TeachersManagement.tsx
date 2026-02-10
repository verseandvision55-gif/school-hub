import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function TeachersManagement() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Teachers</h1>
          <p className="mt-1 text-muted-foreground">Manage teachers in your school.</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UserCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">Teacher management coming soon</p>
            <p className="text-sm text-muted-foreground/70">Assign teachers to your school from the user management.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
