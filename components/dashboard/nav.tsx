// components/dashboard/nav.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardNav() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  // Get initials from the user's name for the avatar fallback
  // e.g. "Isaac Ade" → "IA"
  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between shrink-0">
      {/* Left side: App name / logo */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-primary">ResumeAI</span>
      </div>

      {/* Right side: Theme toggle + user dropdown */}
      <div className="flex items-center gap-3">
        {/* Theme toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {/* Show Sun icon in dark mode, Moon icon in light mode */}
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                {/* Show Google profile picture if available */}
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? "User"}
                />
                {/* Fallback: show initials if no image */}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {session?.user?.name ?? "Account"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Show user info at top of dropdown */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Profile link (placeholder for Phase 2+) */}
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout — signs out and sends user to /login */}
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}