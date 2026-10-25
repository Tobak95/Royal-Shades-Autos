import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** 1240px content column with a 16px gutter on phones and 24px from 640px up */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6", className)} {...props} />;
}
