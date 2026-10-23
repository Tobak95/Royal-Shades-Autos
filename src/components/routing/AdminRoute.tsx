import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";

/** Logged-in users only, and only admins see the content */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      {isAdmin ? (
        children
      ) : (
        <Container className="py-20">
          <EmptyState
            icon={<ShieldAlert aria-hidden="true" className="size-6" />}
            title="Admins only"
            description="Your account doesn't have access to this area. If you think that's a mistake, contact the Royal Shades team."
            action={<ButtonLink to="/">Back to home</ButtonLink>}
          />
        </Container>
      )}
    </ProtectedRoute>
  );
}
