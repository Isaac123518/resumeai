// lib/actions/settings.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Permanently deletes the logged-in user's account along with all
 * related data (analyses, resumes, sessions, linked auth accounts).
 * Order matters here: child records must go before the User row itself,
 * or Postgres will reject the delete on a foreign key constraint.
 */
export async function deleteAccount(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    const userId = session.user.id;

    await prisma.$transaction([
      prisma.analysis.deleteMany({ where: { userId } }),
      prisma.resume.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false, error: "Could not delete your account. Please try again." };
  }
}