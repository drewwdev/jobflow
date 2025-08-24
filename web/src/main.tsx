import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import CompaniesPage from "./routes/CompaniesPage";
import ApplicationsPage from "./routes/ApplicationsPage";
import ApplicationCreatePage from "./routes/ApplicationCreatePage";
import RegisterPage from "./routes/RegisterPage";
import LoginPage from "./routes/LoginPage";
import AuthProvider from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/",
        element: (
          <RequireAuth>
            <div style={{ padding: 16 }}>Home — JobFlow</div>
          </RequireAuth>
        ),
      },
      {
        path: "/companies",
        element: (
          <RequireAuth>
            <CompaniesPage />
          </RequireAuth>
        ),
      },
      {
        path: "/applications",
        element: (
          <RequireAuth>
            <ApplicationsPage />
          </RequireAuth>
        ),
      },
      {
        path: "/applications/new",
        element: (
          <RequireAuth>
            <ApplicationCreatePage />
          </RequireAuth>
        ),
      },
      {
        path: "/applications/:id",
        element: <RequireAuth>{/* <ApplicationDetailPage /> */}</RequireAuth>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
