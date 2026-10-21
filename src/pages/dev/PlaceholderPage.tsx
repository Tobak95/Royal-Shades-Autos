// TEMPORARY: stands in for pages built in later phases.
import { Hammer } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface PlaceholderPageProps {
  title: string;
  crumb: string;
}

export default function PlaceholderPage({ title, crumb }: PlaceholderPageProps) {
  return (
    <>
      <PageHero title={title} breadcrumbs={[{ label: "Home", to: "/" }, { label: crumb }]} />
      <Container className="py-16">
        <EmptyState
          icon={<Hammer aria-hidden="true" className="size-6" />}
          title="This page is coming in a later phase"
          description="The layout, navbar, PageHero and footer are live. The page content comes next."
          action={<ButtonLink to="/">Back to the design system</ButtonLink>}
        />
      </Container>
    </>
  );
}
