import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import UserProfile from "./pages/user-profile";
import AISearch from "./pages/ai-search";

import Layout from "./layout/layout";
import ProtectedLayout from "./layout/protected-layout";
import EmployerDashboard from "./pages/employer-dashboard";
import CreateOrganization from "./pages/create-organization";
import CreateJob from "./pages/create-job";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import JobDetails from "./pages/job-details";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 1,
    },
  },
});

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
          },
          {
            path: "create-job",
            element: <CreateJob />,
          },
          {
            path: "job-details/:id",
            element: <JobDetails />,
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
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
