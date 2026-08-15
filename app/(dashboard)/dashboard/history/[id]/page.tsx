// app/(dashboard)/dashboard/history/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ResultsCard from "@/components/analyze/results-card";
import { getAnalysisById } from "@/lib/actions/history";
import type { AnalysisResult } from "@/lib/actions/analyze";

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = await params;
  const result = await getAnalysisById(id);

  // Shows Next.js's built-in 404 page if the analysis doesn't exist
  // or doesn't belong to the logged-in user
  if (!result.success) {
    notFound();
  }

  const analysis = result.data;

  // Map the Prisma Analysis row into the shape ResultsCard expects,
  // so we can reuse the exact same component from the analyze flow
  const analysisResult: AnalysisResult = {
    matchScore: analysis.matchScore,
    summary: analysis.summary,
    strengths: analysis.strengths,
    gaps: analysis.gaps,
    suggestions: analysis.suggestions,
    resumeId: analysis.resumeId,
    analysisId: analysis.id,
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Link
        href="/dashboard/history"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to history
      </Link>

      <div>
        <h1 className="text-xl font-semibold">Analysis Details</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {analysis.resume.fileName} &middot;{" "}
          {new Date(analysis.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <ResultsCard result={analysisResult} />
    </div>
  );
}