import Link from "next/link";
import { BrainCircuit } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export default function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[hsl(var(--brand-muted))] dark:bg-[hsl(248,50%,8%)] flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl bg-[hsl(var(--brand))]" />

        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--brand))] flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold tracking-tight">ResumeAI</span>
        </Link>

        <div className="relative space-y-6">
          <div className="space-y-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-[hsl(var(--brand))]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-xl font-medium leading-relaxed text-foreground/90">
              "ResumeAI helped me identify exactly what was missing from my resume. Got three interviews in the first week."
            </blockquote>
          </div>
          <div>
            <p className="font-medium text-sm">Sarah Chen</p>
            <p className="text-sm text-muted-foreground">Senior Engineer at Stripe</p>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-6">
          {[
            { value: "94%", label: "Match accuracy" },
            { value: "3×", label: "More interviews" },
            { value: "12k+", label: "Resumes analyzed" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-[hsl(var(--brand))]">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--brand))] flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold">ResumeAI</span>
        </Link>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subheading}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}