import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import UserProfile from "./pages/user-profile";

import Layout from "./layout/layout";
import ProtectedLayout from "./layout/protected-layout";

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
