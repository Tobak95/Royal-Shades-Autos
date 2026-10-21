import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import AboutPage from "@/pages/AboutPage";
import CarDetailsPage from "@/pages/car-details/CarDetailsPage";
import ContactPage from "@/pages/contact/ContactPage";
import PlaceholderPage from "@/pages/dev/PlaceholderPage";
import FaqsPage from "@/pages/FaqsPage";
import GaragePage from "@/pages/garage/GaragePage";
import HomePage from "@/pages/home/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ReservePage from "@/pages/reserve/ReservePage";
import ShowroomPage from "@/pages/showroom/ShowroomPage";
import ThankYouPage from "@/pages/ThankYouPage";
import TrackPage from "@/pages/track/TrackPage";

// TEMPORARY: auth (Phase 3) and account (Phase 4) pages
const placeholders = [
  { path: "login", title: "Log in to your *Garage*", crumb: "Log in" },
  { path: "register", title: "Create your *account*", crumb: "Sign up" },
  { path: "forgot-password", title: "Reset your *password*", crumb: "Forgot password" },
  { path: "account", title: "My *account*", crumb: "Account" },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cars", element: <ShowroomPage /> },
      { path: "cars/:slug", element: <CarDetailsPage /> },
      { path: "track", element: <TrackPage /> },
      { path: "garage", element: <GaragePage /> },
      {
        path: "reserve",
        element: (
          <ProtectedRoute>
            <ReservePage />
          </ProtectedRoute>
        ),
      },
      { path: "thank-you", element: <ThankYouPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "faqs", element: <FaqsPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      ...placeholders.map(({ path, title, crumb }) => ({
        path,
        element: <PlaceholderPage title={title} crumb={crumb} />,
      })),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
