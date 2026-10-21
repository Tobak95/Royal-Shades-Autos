import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import PlaceholderPage from "@/pages/dev/PlaceholderPage";
import StyleGuidePage from "@/pages/dev/StyleGuidePage";

// Phase 1: real pages replace these placeholders from Phase 2 onwards.
const placeholders = [
  { path: "cars", title: "Explore the *Showroom*", crumb: "Showroom" },
  { path: "track", title: "Track your *Voyage*", crumb: "Track" },
  { path: "garage", title: "Your *Garage*", crumb: "Your Garage" },
  { path: "about", title: "About *Royal Shades*", crumb: "About" },
  { path: "contact", title: "Get in *Touch*", crumb: "Contact" },
  { path: "faqs", title: "Frequently asked *questions*", crumb: "FAQs" },
  { path: "account", title: "My *account*", crumb: "Account" },
  { path: "login", title: "Log in to your *Garage*", crumb: "Log in" },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <StyleGuidePage /> },
      ...placeholders.map(({ path, title, crumb }) => ({
        path,
        element: <PlaceholderPage title={title} crumb={crumb} />,
      })),
      { path: "*", element: <PlaceholderPage title="Coming *soon*" crumb="Not built yet" /> },
    ],
  },
]);
