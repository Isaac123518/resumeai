"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { signupAction, googleSignInAction } from "@/lib/actions/auth";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export default function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setGooglePending] = useState(false);
  const [password, setPassword] = useState("");
  const [showRules, setShowRules] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupInput) => {
    startTransition(async () => {
      const result = await signupAction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account created! Welcome to ResumeAI.");
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  const handleGoogle = async () => {
    setGooglePending(true);
    await googleSignInAction();
  };

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogle}
        disabled={isGooglePending || isPending}
      >
        {isGooglePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Alex Johnson"
            autoComplete="name"
            disabled={isPending}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register("password", {
              onChange: (e) => {
                setPassword(e.target.value);
                setShowRules(true);
              },
            })}
            onFocus={() => setShowRules(true)}
          />
          {showRules && (
            <ul className="space-y-1 mt-2">
              {passwordRules.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      passed ? "text-green-500" : "text-muted-foreground"
                    )}
                  >
                    {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-[hsl(var(--brand))] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}