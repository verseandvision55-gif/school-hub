import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Platform-wide insights and reports.</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">Analytics coming soon</p>
            <p className="text-sm text-muted-foreground/70">Charts and reports will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
