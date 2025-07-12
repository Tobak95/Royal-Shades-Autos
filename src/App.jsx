import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import SuspenseLoader from "./component/SuspenseLoader";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ListOfCars = lazy(() => import("./pages/ListOfCars"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

function App() {
  return (
    <Router>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/car-listing" element={<ListOfCars />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
