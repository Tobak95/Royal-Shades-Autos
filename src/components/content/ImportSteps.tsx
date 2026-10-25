import { FadeUp } from "@/components/motion/FadeUp";
import type { Step } from "@/data/content";
import { cn } from "@/lib/utils";

interface ImportStepsProps {
  steps: Step[];
  className?: string;
}

/** Numbered step cards ("01 Choose your car" …) */
export function ImportSteps({ steps, className }: ImportStepsProps) {
  return (
    <ol className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]", className)}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <FadeUp delay={index * 0.08} className="h-full rounded-card border border-line bg-surface p-[26px]">
            <p aria-hidden="true" className="text-[40px] leading-none font-extrabold tracking-[-0.03em] text-gold-text">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-[18px] text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}
