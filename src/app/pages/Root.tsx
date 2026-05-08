import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthProvider } from "../components/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Chatbot } from "../components/Chatbot";

export function Root() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-indigo-600 focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">
          <Outlet />
        </main>
        <Chatbot />
        <Footer />
      </ErrorBoundary>
    </AuthProvider>
  );
}
