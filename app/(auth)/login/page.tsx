// app/(auth)/login/page.tsx
import AuthLayout from "@/components/auth/auth-layout";
import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | ResumeAI",
  description: "Log in to your ResumeAI account",
};

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Enter your details to log in to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}