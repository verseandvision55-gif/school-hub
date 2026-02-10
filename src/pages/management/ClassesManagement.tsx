import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassRecord {
  id: string;
  name: string;
  grade_level: string | null;
  section: string | null;
  created_at: string;
}

export default function ClassesManagement() {
  const { schoolId } = useAuth();
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [section, setSection] = useState("");
  const { toast } = useToast();

  const fetchClasses = async () => {
    if (!schoolId) return;
    const { data } = await supabase.from("classes").select("*").eq("school_id", schoolId).order("name");
    setClasses((data as ClassRecord[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchClasses(); }, [schoolId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    const { error } = await supabase.from("classes").insert({
      school_id: schoolId, name, grade_level: gradeLevel || null, section: section || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Class created" });
      setDialogOpen(false);
      setName(""); setGradeLevel(""); setSection("");
      fetchClasses();
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Classes</h1>
            <p className="mt-1 text-muted-foreground">Manage your school's classes and sections.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Class Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Grade 10 - Science" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="A" />
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Class</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : classes.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">No classes yet</p>
              <p className="text-sm text-muted-foreground/70">Add your first class to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {cls.grade_level && <span>Grade: {cls.grade_level}</span>}
                    {cls.section && <span>Section: {cls.section}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
