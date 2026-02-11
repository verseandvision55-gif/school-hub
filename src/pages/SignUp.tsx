import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, School, Globe, Mail, MapPin, User, Phone, Lock, AlertCircle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function generateSchoolCode(schoolName: string): string {
  const prefix = schoolName.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase().padEnd(3, "X");
  const numbers = String(Math.floor(Math.random() * 900) + 100);
  return prefix + numbers;
}

export default function SignUp() {
  const [schoolName, setSchoolName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // 1. Sign up the user
    const { error: signUpError } = await signUp(adminEmail, password, adminName);
    if (signUpError) {
      setIsLoading(false);
      setError(signUpError.message);
      return;
    }

    // 2. Generate school code and create school record
    const schoolCode = generateSchoolCode(schoolName);
    const slug = schoolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const { error: schoolError } = await supabase.from("schools").insert({
      name: schoolName,
      slug,
      email: schoolEmail,
      address: schoolAddress,
      school_code: schoolCode,
    });

    setIsLoading(false);

    if (schoolError) {
      setError("Account created but failed to register school: " + schoolError.message);
      return;
    }

    setCreatedCode(schoolCode);
    toast({
      title: "School account created!",
      description: "Please save your school code and verify your email.",
    });
  };

  const handleCopy = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (createdCode) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-auth p-4">
        <Card className="w-full max-w-md bg-muted/95 backdrop-blur border-none shadow-2xl">
          <CardContent className="px-8 py-10 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <School className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold">School Created!</h2>
            <p className="text-sm text-muted-foreground">
              Your unique school code is:
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-4xl font-bold tracking-[0.3em] text-primary">
                {createdCode}
              </span>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with your teachers so they can log in. Please also check your email to verify your account.
            </p>
            <Button
              className="w-full rounded-full bg-[hsl(270,80%,50%)] hover:bg-[hsl(270,80%,45%)] text-primary-foreground"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <Card className="w-full max-w-md bg-muted/95 backdrop-blur border-none shadow-2xl">
        <CardContent className="px-8 py-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="font-heading text-lg font-bold mb-3">School Details</h2>
              <div className="space-y-3">
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="pl-10 bg-muted border-border" required />
                </div>
                <Select value={schoolType} onValueChange={setSchoolType}>
                  <SelectTrigger className="bg-muted border-border">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="School type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbse">CBSE</SelectItem>
                    <SelectItem value="matriculation">Matriculation</SelectItem>
                    <SelectItem value="stateboard">State Board</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="School Email address" value={schoolEmail} onChange={e => setSchoolEmail(e.target.value)} className="pl-10 bg-muted border-border" required />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="School Address" value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)} className="pl-10 bg-muted border-border" required />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold mb-3">Admin Details</h2>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Admin Name" value={adminName} onChange={e => setAdminName(e.target.value)} className="pl-10 bg-muted border-border" required />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="pl-10 bg-muted border-border" required />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="tel" placeholder="Mobile Number" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} className="pl-10 bg-muted border-border" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 bg-muted border-border" required />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-[hsl(270,80%,50%)] hover:bg-[hsl(270,80%,45%)] text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                "Create School Account"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
