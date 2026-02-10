import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, School, Users, BookOpen, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: School, title: "Multi-School Support", description: "Manage multiple schools from a single platform with isolated data." },
  { icon: Shield, title: "Role-Based Access", description: "Super Admins, School Admins, and Teachers each get tailored dashboards." },
  { icon: Users, title: "Student Management", description: "Track students, attendance, grades, and performance effortlessly." },
  { icon: BookOpen, title: "Class Organization", description: "Organize classes, assign teachers, and manage subjects." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">EduManage</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <School className="h-4 w-4" /> Multi-School Management Platform
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            One platform to manage{" "}
            <span className="text-primary">all your schools</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Streamline operations across multiple schools with role-based dashboards,
            student tracking, attendance, and grades — all in one secure platform.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/login">
                Start Managing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/demo-school/login">
                Try School Login
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 EduManage. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
