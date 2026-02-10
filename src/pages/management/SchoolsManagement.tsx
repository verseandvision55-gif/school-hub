import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, School, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchoolRecord {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export default function SchoolsManagement() {
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const fetchSchools = async () => {
    const { data } = await supabase.from("schools").select("*").order("created_at", { ascending: false });
    setSchools((data as SchoolRecord[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSchools(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("schools").insert({ name, slug, email: email || null, phone: phone || null });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "School created successfully" });
      setDialogOpen(false);
      setName(""); setEmail(""); setPhone("");
      fetchSchools();
    }
  };

  const toggleActive = async (school: SchoolRecord) => {
    await supabase.from("schools").update({ is_active: !school.is_active }).eq("id", school.id);
    fetchSchools();
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Schools</h1>
            <p className="mt-1 text-muted-foreground">Manage all schools on the platform.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add School</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New School</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Springfield High" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@school.edu" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
                </div>
                <Button type="submit" className="w-full">Create School</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : schools.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <School className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">No schools yet</p>
              <p className="text-sm text-muted-foreground/70">Create your first school to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((school) => (
              <Card key={school.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="font-heading text-lg">{school.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">/{school.slug}/login</p>
                  </div>
                  <Badge variant={school.is_active ? "default" : "secondary"}>
                    {school.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {school.email && <p>{school.email}</p>}
                    {school.phone && <p>{school.phone}</p>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => toggleActive(school)}
                  >
                    {school.is_active ? (
                      <><ToggleRight className="mr-2 h-4 w-4" /> Deactivate</>
                    ) : (
                      <><ToggleLeft className="mr-2 h-4 w-4" /> Activate</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
