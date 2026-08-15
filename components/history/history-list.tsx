// components/history/history-list.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { deleteAnalysis, type HistoryItem } from "@/lib/actions/history";

interface HistoryListProps {
  items: HistoryItem[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-destructive";
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HistoryList({ items }: HistoryListProps) {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteAnalysis(id);
      if (result.success) {
        setRemovedIds((prev) => new Set(prev).add(id));
        toast.success("Analysis deleted");
      } else {
        toast.error(result.error);
      }
      setDeletingId(null);
    });
  }

  const visibleItems = items.filter((item) => !removedIds.has(item.id));

  if (visibleItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
        <FileText className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">No analyses yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Run your first resume analysis to see it appear here.
        </p>
        <Link href="/dashboard/analyze">
          <Button className="mt-4" size="sm">
            New analysis
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visibleItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-lg border px-4 py-3 hover:bg-accent/50 transition-colors"
        >
          <div className="p-2 rounded-md bg-primary/10 shrink-0">
            <FileText className="h-4 w-4 text-primary" />
          </div>

          <Link
            href={`/dashboard/history/${item.id}`}
            className="flex-1 min-w-0 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {item.jobDescription.slice(0, 70)}
                {item.jobDescription.length > 70 ? "..." : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.resumeFileName} &middot; {formatDate(item.createdAt)}
              </p>
            </div>
            <span className={cn("text-sm font-semibold shrink-0", getScoreColor(item.matchScore))}>
              {item.matchScore}
              <span className="text-muted-foreground font-normal">/100</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isPending && deletingId === item.id}
                aria-label="Delete analysis"
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this analysis and its results. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(item.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}