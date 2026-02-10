import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function MyClassesPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">My Classes</h1>
          <p className="mt-1 text-muted-foreground">View and manage your assigned classes.</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No classes assigned yet</p>
            <p className="text-sm text-muted-foreground/70">Your assigned classes will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
