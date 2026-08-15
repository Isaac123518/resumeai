// app/(dashboard)/dashboard/history/page.tsx
import HistoryList from "@/components/history/history-list";
import { getAnalyses } from "@/lib/actions/history";

export default async function HistoryPage() {
  const result = await getAnalyses();
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your past resume analyses, most recent first.
        </p>
      </div>

      {result.success ? (
        <HistoryList items={result.data} />
      ) : (
        <div className="text-sm text-destructive border rounded-lg p-4">
          {result.error}
        </div>
      )}
    </div>
  );
}