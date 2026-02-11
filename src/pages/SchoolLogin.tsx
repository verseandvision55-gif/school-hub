import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AlertCircle, GraduationCap } from "lucide-react";

export default function SchoolLogin() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (code.length < 6) return;
    setError("");
    setIsLoading(true);

    const { data, error: fetchError } = await supabase
      .from("schools")
      .select("id, name, slug, school_code")
      .eq("school_code", code.toUpperCase())
      .maybeSingle();

    setIsLoading(false);

    if (fetchError || !data) {
      setError("Invalid school code. Please check and try again.");
      return;
    }

    // Navigate to role login with school context
    navigate("/role-login", { state: { schoolId: data.id, schoolName: data.name } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center gradient-auth p-4">
      <Card className="w-full max-w-md bg-muted/95 backdrop-blur border-none shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-heading text-3xl font-bold">
            Enter School Code
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your 6-character school code to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full rounded-full bg-[hsl(270,80%,50%)] hover:bg-[hsl(270,80%,45%)] text-primary-foreground"
            disabled={isLoading || code.length < 6}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              "Continue"
            )}
          </Button>

          <div className="text-center space-y-3">
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
