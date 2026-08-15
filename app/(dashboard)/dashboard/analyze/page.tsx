"use client";

import * as React from "react";
import { analyzeResume, type AnalysisResult } from "@/lib/actions/analyze";
import UploadZone from "@/components/analyze/upload-zone";
import JobDescription from "@/components/analyze/job-description";
import ResultsCard from "@/components/analyze/results-card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AnalyzePage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [jobDescription, setJobDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);

  const canSubmit = file !== null && jobDescription.trim().length >= 50 && !isLoading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      const response = await analyzeResume(formData);
      if (response.success) {
        setResult(response.data);
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        setError(response.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setError(null);
    setResult(null);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analyze a Resume</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your resume and paste a job description to get an AI-powered
          match score and feedback.
        </p>
      </div>

      {!result && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Step 1 - Upload your resume
            </h2>
            <UploadZone file={file} onChange={setFile} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Step 2 - Paste the job description
            </h2>
            <JobDescription
              value={jobDescription}
              onChange={setJobDescription}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your resume...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>

          {isLoading && (
            <p className="text-xs text-center text-muted-foreground">
              This usually takes 10 to 20 seconds. Please keep this page open.
            </p>
          )}
        </div>
      )}

      {result && (
        <div id="results" className="space-y-4">
          <ResultsCard result={result} />
          <Button variant="outline" onClick={handleReset} className="w-full">
            Analyze another resume
          </Button>
        </div>
      )}
    </div>
  );
}