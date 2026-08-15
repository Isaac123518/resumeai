"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { BrainCircuit, LayoutDashboard, FileText, History, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  // exact: true means this link only highlights on a precise pathname match.
  // Dashboard needs this because "/dashboard/analyze" also starts with
  // "/dashboard", which would otherwise highlight both links at once.
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "New analysis", href: "/dashboard/analyze", icon: FileText },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="hidden lg:flex w-56 flex-col border-r bg-card/50 px-3 py-5 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-7 h-7 rounded-md bg-[hsl(var(--brand))] flex items-center justify-center shrink-0">
          <BrainCircuit className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <span className="font-semibold text-sm tracking-tight">ResumeAI</span>
      </Link>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand))] font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t pt-3 mt-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
          <div className="w-7 h-7 rounded-full bg-[hsl(var(--brand-muted))] flex items-center justify-center text-xs font-medium text-[hsl(var(--brand))] shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{user?.name ?? "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}