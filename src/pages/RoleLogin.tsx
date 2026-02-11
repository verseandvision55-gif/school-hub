import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function RoleCard({ title, onSubmit, isLoading }: { title: string; onSubmit: (email: string, password: string) => Promise<void>; isLoading: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="w-full bg-muted/95 backdrop-blur border-none shadow-2xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-heading text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-background border-border" required />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-background border-border" required />
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : "Log In"}
            </Button>
          </div>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-xs text-muted-foreground">or</p>
          <p className="text-xs text-muted-foreground">Forgot password?</p>
          <Input placeholder="Enter Email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="bg-background border-border" />
          <Button variant="outline" size="sm" className="rounded-full border-primary text-primary hover:bg-primary/10">
            Reset password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RoleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const schoolName = (location.state as any)?.schoolName || "School";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) throw error;
    toast({ title: "Welcome back!", description: "You've been logged in successfully." });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center gradient-auth p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 left-6 text-primary-foreground hover:bg-primary-foreground/10"
        asChild
      >
        <Link to="/login">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </Button>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <GraduationCap className="h-8 w-8 text-primary-foreground" />
        <span className="text-primary-foreground font-heading font-bold text-lg">{schoolName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <RoleCard title="Admin login" onSubmit={handleLogin} isLoading={isLoading} />
        <RoleCard title="Teachers login" onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
