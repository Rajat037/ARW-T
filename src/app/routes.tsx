import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "pricing", Component: Pricing },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "profile", Component: Profile },
      { path: "dashboard", Component: Dashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
