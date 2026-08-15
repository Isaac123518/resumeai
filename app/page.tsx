// app/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FileText, BarChart2, Zap, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeAI — Match your resume to any job",
  description:
    "Upload your resume, paste a job description, and get an AI-powered match score with actionable feedback in seconds.",
};

const features = [
  {
    icon: FileText,
    title: "Resume Parsing",
    description:
      "Upload your PDF resume and we extract the content accurately — no copy-pasting required.",
  },
  {
    icon: BarChart2,
    title: "Match Scoring",
    description:
      "Get a precise match score showing how well your resume aligns with the job description.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description:
      "Receive specific, actionable suggestions to improve your resume for each role you apply to.",
  },
  {
    icon: ShieldCheck,
    title: "Private and Secure",
    description:
      "Your resume data is tied to your account only. We never share or sell your information.",
  },
];

export default async function HomePage() {
  // If user is already logged in, skip the landing page entirely
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Navigation bar ── */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-primary">ResumeAI</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero section ── */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Know exactly how well your resume fits the job
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Paste a job description, upload your resume, and get an AI-powered
            match score with clear feedback — in under 30 seconds.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/signup">Create a free account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features section ── */}
      <section className="border-t border-border bg-muted/30 px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Everything you need to apply with confidence
            </h2>
            <p className="text-sm text-muted-foreground">
              Built for job seekers who want real feedback, not generic advice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border shadow-none">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <div className="mt-0.5 p-2 rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
