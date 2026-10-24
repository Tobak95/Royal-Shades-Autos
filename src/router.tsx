import { createBrowserRouter } from "react-router-dom";
import { RootLayout, type RouteHandle } from "@/components/layout/RootLayout";
import { AdminRoute } from "@/components/routing/AdminRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import AboutPage from "@/pages/AboutPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import CarEditorPage from "@/pages/admin/cars/CarEditorPage";
import CarsPage from "@/pages/admin/cars/CarsPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import OverviewPage from "@/pages/admin/OverviewPage";
import ReservationsPage from "@/pages/admin/ReservationsPage";
import ShipmentsPage from "@/pages/admin/shipments/ShipmentsPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
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
import TermsPage from "@/pages/TermsPage";
import ThankYouPage from "@/pages/ThankYouPage";
import TrackPage from "@/pages/track/TrackPage";

const slim: RouteHandle = { footer: "slim" };

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage />, handle: { topBar: true } satisfies RouteHandle },
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
      { path: "terms", element: <TermsPage /> },
      // TEMPORARY: Swap and Sell pages are placeholders until their flows are designed
      { path: "swap", element: <PlaceholderPage title="Swap your *car*" crumb="Swap" /> },
      { path: "sell", element: <PlaceholderPage title="Sell your *car*" crumb="Sell" /> },

      // Auth
      { path: "login", element: <LoginPage />, handle: slim },
      { path: "register", element: <SignUpPage />, handle: slim },
      { path: "forgot-password", element: <ForgotPasswordPage />, handle: slim },
      { path: "reset-password/:token", element: <ResetPasswordPage />, handle: slim },
      { path: "verify-email/:token", element: <VerifyEmailPage />, handle: slim },

      // TEMPORARY: account (Phase 4)
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="My *account*" crumb="Account" />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // Admin dashboard: its own full-screen layout, no site navbar or footer
  // (mock data until the admin API exists; see README)
  {
    path: "admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "cars", element: <CarsPage /> },
      { path: "cars/new", element: <CarEditorPage /> },
      { path: "cars/:id/edit", element: <CarEditorPage /> },
      { path: "shipments", element: <ShipmentsPage /> },
      { path: "reservations", element: <ReservationsPage /> },
      { path: "customers", element: <CustomersPage /> },
    ],
  },
]);
