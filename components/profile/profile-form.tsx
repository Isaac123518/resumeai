// components/profile/profile-form.tsx
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfileName } from "@/lib/actions/profile";

interface ProfileFormProps {
  initialName: string;
  email: string;
}

export default function ProfileForm({ initialName, email }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProfileName(name);
      if (result.success) {
        setMessage({ type: "success", text: "Name updated." });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  const initial = (initialName || email || "U")[0]?.toUpperCase() ?? "U";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Account details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--brand-muted))] flex items-center justify-center text-lg font-medium text-[hsl(var(--brand))] shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{initialName || "No name set"}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="bg-muted/30" />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={100}
              disabled={isPending}
            />
          </div>

          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
              {message.text}
            </p>
          )}

          <Button type="submit" disabled={isPending || name.trim() === initialName.trim()}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}