// app/(auth)/signup/page.tsx
import AuthLayout from "@/components/auth/auth-layout";
import SignupForm from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account | ResumeAI",
  description: "Create your free ResumeAI account",
};

export default function SignupPage() {
  return (
    <AuthLayout
      heading="Create an account"
      subheading="Enter your details to get started for free"
    >
      <SignupForm />
    </AuthLayout>
  );
}