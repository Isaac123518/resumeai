// components/analyze/results-card.tsx
import { CheckCircle2, XCircle, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/actions/analyze";

interface ResultsCardProps {
  result: AnalysisResult;
}

// Returns a color and label based on the match score range
function getScoreProfile(score: number): {
  color: string;
  label: string;
  ringColor: string;
} {
  if (score >= 80) return { color: "text-green-500", ringColor: "stroke-green-500", label: "Strong match" };
  if (score >= 60) return { color: "text-yellow-500", ringColor: "stroke-yellow-500", label: "Moderate match" };
  if (score >= 40) return { color: "text-orange-500", ringColor: "stroke-orange-500", label: "Partial match" };
  return { color: "text-destructive", ringColor: "stroke-destructive", label: "Low match" };
}

// Circular SVG score ring
function ScoreRing({ score }: { score: number }) {
  const profile = getScoreProfile(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // How much of the ring to fill based on score
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/40"
          />
          {/* Score ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-700", profile.ringColor)}
          />
        </svg>
        {/* Score number in the centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", profile.color)}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className={cn("text-sm font-medium", profile.color)}>
        {profile.label}
      </span>
    </div>
  );
}

export default function ResultsCard({ result }: ResultsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Analysis Results</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score + summary row */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <ScoreRing score={result.matchScore} />
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-medium">Overall Assessment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>

        <Separator />

        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            <h3 className="text-sm font-medium">Strengths</h3>
          </div>
          <ul className="space-y-2 pl-6">
            {result.strengths.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Gaps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive shrink-0" />
            <h3 className="text-sm font-medium">Gaps</h3>
          </div>
          <ul className="space-y-2 pl-6">
            {result.gaps.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0" />
            <h3 className="text-sm font-medium">Suggestions</h3>
          </div>
          <ul className="space-y-2 pl-6">
            {result.suggestions.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer — link to view full history */}
        <Separator />
        <div className="flex items-center gap-2 pt-1">
          <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            This analysis has been saved to your account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}