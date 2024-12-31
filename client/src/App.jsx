import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Login from "./components/auth/Login";
import Navbar from "./components/layout/Navbar";
import Department from "./components/page/Department/Department";
import Fee from "./components/page/Fee/Fee";
import People from "./components/page/People/People";
import Home from "./components/page/Home/Home";
import Vehicle from "./components/page/Vehicle/Vehicle";
import ChangePassword from "./components/auth/ChangePassword";
import "./App.css";

// PrivateRoute component to handle protected routes
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { auth } = useAuth();
  const isAuthenticated = auth.isAuthenticated;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

// NavbarWrapper component to conditionally render Navbar based on the route
const NavbarWrapper = () => {
  const location = useLocation();
  const shouldHideNavbar = location.pathname === "/login";
  return !shouldHideNavbar && <Navbar />;
};

// App component including navigation and routing logic
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/department"
            element={
              <PrivateRoute>
                <Department />
              </PrivateRoute>
            }
          />
          <Route
            path="/fee"
            element={
              <PrivateRoute>
                <Fee />
              </PrivateRoute>
            }
          />
          <Route
            path="/people"
            element={
              <PrivateRoute>
                <People />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicle"
            element={
              <PrivateRoute>
                <Vehicle />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
