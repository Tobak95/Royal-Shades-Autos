import type { ReactNode } from "react";
import { AccentText } from "@/components/ui/AccentText";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface AdminHeaderProps {
  /** Wrap the accent word in asterisks */
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow>Admin</Eyebrow>
        <h1 className="mt-1.5 text-[30px] leading-tight font-extrabold tracking-[-0.03em] sm:text-[34px]">
          <AccentText text={title} />
        </h1>
        {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}
