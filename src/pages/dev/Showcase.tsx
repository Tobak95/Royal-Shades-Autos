import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

/** A titled block on the temporary style guide */
export function Showcase({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="p-6 sm:p-7">
      <h3 className="text-xs font-semibold tracking-eyebrow text-muted uppercase">{title}</h3>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
