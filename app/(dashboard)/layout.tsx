// app/(dashboard)/layout.tsx
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard/nav";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session on the server before rendering anything
  // If no session exists, send user to login immediately
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    // SessionProvider makes session available to all client components below
    <SessionProvider session={session}>
      <div className="flex h-screen bg-background overflow-hidden">

        {/* Left sidebar — fixed width, full height */}
        <Sidebar />

        {/* Right side — navbar on top, page content below */}
        <div className="flex flex-col flex-1 min-w-0">
          <DashboardNav />

          {/* Main content area — scrollable */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>

      </div>
    </SessionProvider>
  );
}