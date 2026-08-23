// lib/actions/analyze.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/utils/pdf";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalysisResult {
  matchScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  resumeId: string;
  analysisId: string;
}

export async function analyzeResume(
  formData: FormData
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to analyze a resume." };
    }

    const file = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file || file.size === 0) {
      return { success: false, error: "Please upload a PDF resume." };
    }
    if (!jobDescription || jobDescription.trim().length < 50) {
      return { success: false, error: "Please enter a job description (at least 50 characters)." };
    }
    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are supported." };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be under 5MB." };
    }

   let resumeText: string;
   try {
      resumeText = await extractTextFromPDF(file);
   } catch (err) {
      console.error("PDF extraction failed:", err); // keep this — logs to your terminal for debugging, but user sees a clean message
      return { success: false, error: "Could not read your PDF. Make sure it is not a scanned image." };
   }

    const prompt = `You are an expert resume reviewer and career coach.

Analyze the following resume against the job description and return a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}

Rules:
- matchScore must be a number between 0 and 100
- strengths, gaps, and suggestions must each have between 2 and 5 items
- Be specific and actionable
- Return ONLY the JSON object, no other text

JOB DESCRIPTION:
${jobDescription.trim()}

RESUME:
${resumeText.slice(0, 6000)}`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const rawResponse = completion.choices[0]?.message?.content ?? "";

    let parsed: Omit<AnalysisResult, "resumeId" | "analysisId">;
    try {
      const cleaned = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return { success: false, error: "The AI returned an unexpected response. Please try again." };
    }

    if (typeof parsed.matchScore !== "number" || parsed.matchScore < 0 || parsed.matchScore > 100) {
      return { success: false, error: "Invalid analysis response. Please try again." };
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileSize: file.size,
        extractedText: resumeText,
      },
    });

    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        jobDescription: jobDescription.trim(),
        matchScore: parsed.matchScore,
        strengths: parsed.strengths,
        gaps: parsed.gaps,
        suggestions: parsed.suggestions,
        summary: parsed.summary,
      },
    });

    return {
      success: true,
      data: {
        matchScore: parsed.matchScore,
        summary: parsed.summary,
        strengths: parsed.strengths,
        gaps: parsed.gaps,
        suggestions: parsed.suggestions,
        resumeId: resume.id,
        analysisId: analysis.id,
      },
    };
  } catch (error) {
    console.error("Analysis error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}