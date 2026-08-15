// lib/actions/profile.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileName(
  name: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, error: "Name cannot be empty." };
    }
    if (trimmed.length > 100) {
      return { success: false, error: "Name must be under 100 characters." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: trimmed },
    });

    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Could not update your name. Please try again." };
  }
}