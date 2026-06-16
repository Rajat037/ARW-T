import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
