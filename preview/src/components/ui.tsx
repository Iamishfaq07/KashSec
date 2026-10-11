import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const tones = {
  amber: "bg-amber text-amber-ink",
  ghost: "border border-line bg-transparent text-fg",
  teal: "bg-teal text-teal-ink",
  quiet: "bg-surface text-fg",
} as const;

export function Button({
  tone = "amber",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof tones }) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
        "disabled:opacity-50",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-bg px-3 text-fg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
