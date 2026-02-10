import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function GradesPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Grades</h1>
          <p className="mt-1 text-muted-foreground">Manage student grades and assessments.</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No grades recorded yet</p>
            <p className="text-sm text-muted-foreground/70">Start recording grades for your students.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
