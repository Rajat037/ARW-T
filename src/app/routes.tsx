import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Root } from "./pages/Root";
import { ProtectedRoute, GuestRoute } from "./components/RouteGuards";

// Lazy load all pages for code splitting
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Pricing = lazy(() => import("./pages/Pricing").then((m) => ({ default: m.Pricing })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Signup").then((m) => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then((m) => ({ default: m.ForgotPassword })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));
const Profile = lazy(() => import("./pages/Profile").then((m) => ({ default: m.Profile })));
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Faq = lazy(() => import("./pages/Faq").then((m) => ({ default: m.Faq })));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
      { path: "pricing", element: <SuspenseWrapper><Pricing /></SuspenseWrapper> },
      { path: "contact", element: <SuspenseWrapper><Contact /></SuspenseWrapper> },
      { path: "faq", element: <SuspenseWrapper><Faq /></SuspenseWrapper> },
      
      // Guest-only routes (redirects to dashboard if logged in)
      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: <SuspenseWrapper><Login /></SuspenseWrapper> },
          { path: "signup", element: <SuspenseWrapper><Signup /></SuspenseWrapper> },
          { path: "forgot-password", element: <SuspenseWrapper><ForgotPassword /></SuspenseWrapper> },
        ]
      },

      // Protected routes (redirects to login if not logged in)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
          { path: "dashboard", element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
        ]
      },

      { path: "*", element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
    ],
  },
]);
