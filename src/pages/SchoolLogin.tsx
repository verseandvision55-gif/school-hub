import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SchoolLogin() {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      navigate("/dashboard");
    }
  };

  const displayName = schoolSlug
    ? schoolSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center gradient-auth p-4">
      <Card className="w-full max-w-md bg-muted/95 backdrop-blur border-none shadow-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-heading text-3xl font-bold">
            {displayName ? `${displayName} Login` : "Login"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">School Email id</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-[hsl(270,80%,50%)] hover:bg-[hsl(270,80%,45%)] text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">or</p>
            <p className="text-sm text-muted-foreground">Don't have an account?</p>
            <Button
              variant="ghost"
              className="w-full rounded-full bg-[hsl(270,80%,50%)] hover:bg-[hsl(270,80%,45%)] text-primary-foreground"
              asChild
            >
              <Link to="/signup">Create New School Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
