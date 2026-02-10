import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Attendance</h1>
          <p className="mt-1 text-muted-foreground">Mark and track student attendance.</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UserCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">Select a class to begin</p>
            <p className="text-sm text-muted-foreground/70">Attendance tracking will be available once you have assigned classes.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
