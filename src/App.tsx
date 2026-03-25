import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import UserProfile from "./pages/user-profile";
import AISearch from "./pages/ai-search";

import Layout from "./layout/layout";
import ProtectedLayout from "./layout/protected-layout";
import EmployerDashboard from "./pages/employer-dashboard";
import CreateOrganization from "./pages/create-organization";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "app",
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <div>App</div> },
          {
            path: "user-profile",
            element: <UserProfile />,
          },
          {
            path: "ai-search",
            element: <AISearch />,
          },
          {
            path: "employer-dashboard",
            element: <EmployerDashboard />,
          },
          {
            path: "create-organization",
            element: <CreateOrganization />,
          }
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
