import { cn } from "@/lib/utils";

interface AccentTextProps {
  /** Wrap the accent word in asterisks: "Explore the *Showroom*" */
  text: string;
  className?: string;
}

/** Renders the gold Cormorant italic accent word inside a heading */
export function AccentText({ text, className }: AccentTextProps) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span
            key={index}
            className={cn("font-accent text-[1.15em] font-semibold tracking-[-0.01em] text-gold italic", className)}
          >
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
