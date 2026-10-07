import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Prediction from "../pages/Prediction/Prediction";
import History from "../pages/History/History";
import Dashboard from "../pages/Dashboard/Dashboard";
import DoctorDashboard from "../pages/DoctorDashboard/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import About from "../components/About/About";
import Services from "../components/Services/Services";
import Statistics from "../components/Statistics/Statistics";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Services />
      <Statistics />
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Patient Routes */}

        <Route
          path="/predict"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Prediction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Doctor Route */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        {/* Admin Route */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;