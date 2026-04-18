"use client";

import { cn } from "@/lib/utils";

interface OptionButtonProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({
  label,
  description,
  selected,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-6 py-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/[0.02]"
      )}
    >
      <span className="font-medium text-foreground">{label}</span>
      {description && (
        <span className="block text-sm text-muted-foreground mt-0.5">
          {description}
        </span>
      )}
    </button>
  );
}
