// components/analyze/job-description.tsx
"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MIN_CHARS = 50;
const MAX_CHARS = 5000;

export default function JobDescription({ value, onChange, disabled }: JobDescriptionProps) {
  const charCount = value.length;
  const isBelowMin = charCount > 0 && charCount < MIN_CHARS;
  const isAtMax = charCount >= MAX_CHARS;

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Job description
        </label>
        {/* Character counter — only shows once user starts typing */}
        {charCount > 0 && (
          <span
            className={cn(
              "text-xs tabular-nums",
              isBelowMin && "text-destructive",
              isAtMax && "text-destructive",
              !isBelowMin && !isAtMax && "text-muted-foreground"
            )}
          >
            {charCount} / {MAX_CHARS}
          </span>
        )}
      </div>

      {/* Textarea */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        disabled={disabled}
        placeholder="Paste the full job description here — include the role, responsibilities, and required qualifications for the most accurate analysis."
        className={cn(
          "min-h-[200px] resize-y text-sm leading-relaxed",
          isBelowMin && "border-destructive/50 focus-visible:ring-destructive/30"
        )}
      />

      {/* Helper text row */}
      <div className="flex items-center justify-between">
        {isBelowMin ? (
          <p className="text-xs text-destructive">
            {MIN_CHARS - charCount} more characters needed
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Paste the complete job posting for best results
          </p>
        )}
      </div>
    </div>
  );
}