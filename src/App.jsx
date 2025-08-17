// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Layouts
import BasicLayout from "./layouts/BasicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PrivacyPolicy from "./components/PrivacyPolicy";


// Components
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProfilePage from "./components/ProfilePage";
import AllTasks from "./components/AllTasks";

// Worker
import WorkerHome from "./components/Worker/WorkerHome";
import TaskList from "./components/Worker/TaskList";
import TaskDetails from "./components/Worker/TaskDetails";
import MySubmissions from "./components/Worker/MySubmissions";
import Withdrawals from "./components/Worker/Withdrawals";

// Buyer
import BuyerHome from "./components/Buyer/BuyerHome";
import AddTask from "./components/Buyer/AddTask";
import MyTasks from "./components/Buyer/MyTasks";
import BuyerSubmissions from "./components/Buyer/BuyerSubmissions";
import PurchaseCoin from "./components/Buyer/PurchaseCoin";
import PaymentHistory from "./components/Buyer/PaymentHistory";

// Admin
import AdminHome from "./components/Admin/AdminHome";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageTasks from "./components/Admin/ManageTasks";
import WithdrawalRequests from "./components/Admin/WithdrawalRequests";

// 404
import NotFound from "./components/NotFound";

// Dashboard Redirect Component
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const DashboardRedirect = () => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) return null; // or a loading spinner

  switch (userInfo.role) {
    case "worker":
      return <Navigate to="/dashboard/worker-home" replace />;
    case "buyer":
      return <Navigate to="/dashboard/buyer-home" replace />;
    case "admin":
      return <Navigate to="/dashboard/admin-home" replace />;
    default:
      return <Navigate to="/dashboard/profile" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <ToastContainer position="top-center" autoClose={3000} />
          <Routes>
            {/* Public Routes */}
            <Route element={<BasicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Protected AllTasks (outside dashboard) */}
              <Route
                path="/all-tasks"
                element={
                  <ProtectedRoute>
                    <AllTasks />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Default redirect based on role */}
              <Route
                index
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />

              {/* Worker */}
              <Route path="worker-home" element={<WorkerHome />} />
              <Route path="tasklist" element={<TaskList />} />
              <Route path="tasks/:id" element={<TaskDetails />} />
              <Route path="submissions" element={<MySubmissions />} />
              <Route path="withdrawals" element={<Withdrawals />} />

              {/* Buyer */}
              <Route path="buyer-home" element={<BuyerHome />} />
              <Route path="add-task" element={<AddTask />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="buyer-submissions" element={<BuyerSubmissions />} />
              <Route path="purchase-coin" element={<PurchaseCoin />} />
              <Route path="payment-history" element={<PaymentHistory />} />

              {/* Admin */}
              <Route path="admin-home" element={<AdminHome />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="withdrawal-requests" element={<WithdrawalRequests />} />

              {/* Profile (all roles) */}
              <Route path="profile" element={<ProfilePage />} />

              {/* All Tasks (buyer/admin) */}
              <Route
                path="all-tasks"
                element={
                  <ProtectedRoute>
                    <AllTasks />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Elements>
    </AuthProvider>
  );
}

export default App;
