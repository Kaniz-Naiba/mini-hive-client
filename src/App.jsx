// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Public Pages
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Dashboard Home
import DashboardHome from "./components/DashboardHome";

// Worker Pages
import WorkerHome from "./components/Worker/WorkerHome";
import TaskList from "./components/Worker/TaskList";
import TaskDetails from "./components/Worker/TaskDetails";
import MySubmissions from "./components/Worker/MySubmissions";
import Withdrawals from "./components/Worker/Withdrawals";

// Buyer Pages
import BuyerHome from "./components/Buyer/BuyerHome";
import AddTask from "./components/Buyer/AddTask";
import MyTasks from "./components/Buyer/MyTasks";
import BuyerSubmissions from "./components/Buyer/BuyerSubmissions";
import PurchaseCoin from "./components/Buyer/PurchaseCoin";
import PaymentHistory from "./components/Buyer/PaymentHistory";

// Admin Pages
import AdminHome from "./components/Admin/AdminHome";
import ManageUsers from "./components/Admin/ManageUsers";
import ManageTasks from "./components/Admin/ManageTasks";
import WithdrawalRequests from "./components/Admin/WithdrawalRequests";

// 404 Page
import NotFound from "./components/NotFound";

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
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />

              {/* Worker Routes */}
              <Route path="worker-home" element={<WorkerHome />} />
              <Route path="tasklist" element={<TaskList />} />
              <Route path="tasks/:id" element={<TaskDetails />} />
              <Route path="submissions" element={<MySubmissions />} />
              <Route path="withdrawals" element={<Withdrawals />} />

              {/* Buyer Routes */}
              <Route path="buyer-home" element={<BuyerHome />} />
              <Route path="add-task" element={<AddTask />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="buyer-submissions" element={<BuyerSubmissions />} />
              <Route path="purchase-coin" element={<PurchaseCoin />} />
              <Route path="payment-history" element={<PaymentHistory />} />

              {/* Admin Routes */}
              <Route path="admin-home" element={<AdminHome />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="withdrawal-requests" element={<WithdrawalRequests />} />
            </Route>

            {/* Catch-all route (404 Not Found) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Elements>
    </AuthProvider>
    
  );
}

export default App;
