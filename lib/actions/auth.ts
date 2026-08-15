"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  signupSchema,
  loginSchema,
  type SignupInput,
  type LoginInput,
} from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

type ActionResult = { error?: string; success?: boolean };

export async function loginAction(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
    }
    return { error: "Something went wrong. Try again." };
  }
}

export async function signupAction(data: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch {
    return { error: "Account created — please sign in" };
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}