// components/analyze/upload-zone.tsx
"use client";

import * as React from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function UploadZone({ file, onChange, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validateAndSet(selected: File) {
    setError(null);

    if (selected.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    onChange(selected);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSet(selected);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setError(null);
    // Reset the input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  // Format bytes into a readable size string — e.g. 204800 → "200.0 KB"
  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !disabled && !file && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          "flex flex-col items-center justify-center text-center p-8 min-h-[160px]",
          // State-based styles
          file
            ? "border-border bg-muted/30 cursor-default"
            : "cursor-pointer hover:border-primary/50 hover:bg-muted/20",
          isDragging && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive/50"
        )}
      >
        {/* Hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {file ? (
          // ── File selected state ──
          <div className="flex items-center gap-3 w-full max-w-sm">
            <div className="p-2 rounded-md bg-primary/10 shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            {!disabled && (
              <button
                onClick={handleRemove}
                className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ) : (
          // ── Empty/drag state ──
          <div className="space-y-2">
            <div className="flex justify-center">
              <UploadCloud
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragging ? "Drop your resume here" : "Drag and drop your resume"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or{" "}
                <span className="text-primary underline underline-offset-2">
                  click to browse
                </span>
                {" "}— PDF only, max 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Validation error message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}