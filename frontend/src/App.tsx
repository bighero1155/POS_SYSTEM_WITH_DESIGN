import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductManagement from "./components/Products/ProductManagement";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import POSDashboard from "./components/POS/POSDashboard";
import UserManagement from "./components/Users/UserManagement";
import CategoryManagement from "./components/category/CategoryManagement";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SurveyForm from "./pages/SurveyForm";
import SurveyReport from "./components/Reports/SurveyReport";
import Reports from "./components/Reports/Reports";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        style={{
          flexGrow: 1,
          marginLeft: isSidebarOpen ? 280 : 70,
          transition: "margin-left 0.3s ease",
          padding: "1rem",
        }}
      >
        {children}
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["cashier", "manager", "admin"]}>
        <MainLayout>
          <POSDashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <MainLayout>
          <ProductManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <MainLayout>
          <UserManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories",
    element: (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <MainLayout>
          <CategoryManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/survey",
    element: (
      <ProtectedRoute allowedRoles={["cashier", "manager", "admin"]}>
        <MainLayout>
          <SurveyForm />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports/surveys",
    element: (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <MainLayout>
          <SurveyReport />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <MainLayout>
          <Reports />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
  },
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
