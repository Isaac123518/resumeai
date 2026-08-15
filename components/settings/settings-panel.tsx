// components/settings/settings-panel.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Sun, Moon, LogOut, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { deleteAccount } from "@/lib/actions/settings";

export default function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch — same mounted-state pattern used in
  // theme-provider.tsx, since next-themes can't know the theme until
  // the client has mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      const result = await deleteAccount();
      if (result.success) {
        // Account is gone — sign out and send the user to the homepage
        toast.success("Account deleted");
        await signOut({ callbackUrl: "/" });
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {mounted && theme === "dark" ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Theme</span>
            </div>
            {mounted && (
              <div className="flex items-center gap-1 border rounded-md p-0.5">
                <button
                  onClick={() => setTheme("light")}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    theme === "light" ? "bg-accent font-medium" : "text-muted-foreground"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    theme === "dark" ? "bg-accent font-medium" : "text-muted-foreground"
                  }`}
                >
                  Dark
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account on this device.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign out
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Delete account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all your data.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will erase all your analyses and resumes. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}