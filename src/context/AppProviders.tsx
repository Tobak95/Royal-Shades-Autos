import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./AuthProvider";
import { GarageProvider } from "./GarageProvider";
import { ToastProvider } from "./ToastProvider";
import { WishlistProvider } from "./WishlistProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // "user" makes every framer-motion animation respect prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AuthProvider>
          <GarageProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </GarageProvider>
        </AuthProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
