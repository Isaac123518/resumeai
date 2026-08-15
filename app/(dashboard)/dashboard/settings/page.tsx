// app/(dashboard)/dashboard/settings/page.tsx
import SettingsPanel from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <div className="max-w-lg mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your preferences and account.
        </p>
      </div>

      <SettingsPanel />
    </div>
  );
}