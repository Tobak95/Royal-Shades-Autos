import { cn } from "@/lib/utils";

interface AccentTextProps {
  /** Wrap the accent word in asterisks: "Explore the *Showroom*" */
  text: string;
  /** "light" for headings on navy or dark photos */
  tone?: "dark" | "light";
  className?: string;
}

/** Highlights the accent word in gold, same font as the heading */
export function AccentText({ text, tone = "dark", className }: AccentTextProps) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={index} className={cn(tone === "light" ? "text-gold-light" : "text-gold-text", className)}>
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
