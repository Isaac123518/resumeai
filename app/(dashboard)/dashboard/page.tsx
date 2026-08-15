// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { FileText, BarChart2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | ResumeAI",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch this user's stats from the database in parallel
  // Promise.all runs both queries at the same time instead of one after the other
  const [resumeCount, analysisCount] = await Promise.all([
    prisma.resume.count({
      where: { userId: session.user.id },
    }),
    prisma.analysis.count({
      where: { userId: session.user.id },
    }),
  ]);

  // Find the most recent analysis for "last activity" display
  const lastAnalysis = await prisma.analysis.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  // Format the date cleanly — e.g. "08 July 2026"
  const lastActive = lastAnalysis
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(lastAnalysis.createdAt))
    : "No activity yet";

  // First name only for the greeting — "Isaac Ade" → "Isaac"
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Resumes Uploaded",
      value: resumeCount,
      icon: FileText,
      description: "Total resumes in your account",
    },
    {
      label: "Analyses Run",
      value: analysisCount,
      icon: BarChart2,
      description: "Total AI analyses completed",
    },
    {
      label: "Last Activity",
      value: lastActive,
      icon: Clock,
      description: "Most recent analysis date",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header — greeting + action button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here is a summary of your ResumeAI activity.
          </p>
        </div>

        {/* Primary action — will link to upload page in Phase 2 */}
        <Button asChild>
          <Link href="/dashboard/analyze">Analyze a Resume</Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state — shown when user has no resumes yet */}
      {resumeCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-base font-medium mb-1">No resumes yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Upload your resume and a job description to get an AI-powered
              match score and tailored feedback.
            </p>
            <Button asChild>
              <Link href="/dashboard/analyze">Get started</Link>
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}