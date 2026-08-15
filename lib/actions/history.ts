// lib/actions/history.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface HistoryItem {
  id: string;
  jobDescription: string;
  matchScore: number;
  createdAt: Date;
  resumeFileName: string;
}

/**
 * Fetches all past analyses for the currently logged-in user,
 * newest first. Used by the History page list view.
 */
export async function getAnalyses(): Promise<
  { success: true; data: HistoryItem[] } | { success: false; error: string }
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to view history." };
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        resume: {
          select: { fileName: true },
        },
      },
    });

    const data: HistoryItem[] = analyses.map((a) => ({
      id: a.id,
      jobDescription: a.jobDescription,
      matchScore: a.matchScore,
      createdAt: a.createdAt,
      resumeFileName: a.resume.fileName,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return { success: false, error: "Could not load your analysis history." };
  }
}

/**
 * Fetches a single analysis by id, scoped to the logged-in user so
 * one user can never view another user's analysis by guessing an id.
 */
export async function getAnalysisById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false as const, error: "You must be logged in to view this analysis." };
    }

    const analysis = await prisma.analysis.findFirst({
      where: { id, userId: session.user.id },
      include: {
        resume: {
          select: { fileName: true },
        },
      },
    });

    if (!analysis) {
      return { success: false as const, error: "Analysis not found." };
    }

    return { success: true as const, data: analysis };
  } catch (error) {
    console.error("Failed to fetch analysis:", error);
    return { success: false as const, error: "Could not load this analysis." };
  }
}

/**
 * Deletes a single analysis, scoped to the logged-in user so one user
 * can never delete another user's data by guessing an id.
 */
export async function deleteAnalysis(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    // deleteMany + userId filter means this silently does nothing if the
    // analysis doesn't belong to this user, instead of throwing or deleting
    // someone else's row
    const result = await prisma.analysis.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (result.count === 0) {
      return { success: false, error: "Analysis not found." };
    }

    // Refresh the history page's cached data so the deleted item
    // disappears immediately without a manual page reload
    revalidatePath("/dashboard/history");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete analysis:", error);
    return { success: false, error: "Could not delete this analysis." };
  }
}