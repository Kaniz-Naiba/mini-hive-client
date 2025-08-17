// src/components/DashboardHome.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardHome() {
  const { user, userInfo } = useContext(AuthContext);
  const name = userInfo?.name || user?.displayName || "User";
  const role = userInfo?.role || "worker";

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center shadow-md transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
        Welcome back, <span className="text-gray-800 dark:text-gray-200">{name}</span>! 👋
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        You’re logged in as{" "}
        <span className="capitalize font-semibold text-green-500 dark:text-green-400">{role}</span>.
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        Explore your dashboard and make the most of MiniHive! Whether you're here to work, hire,
        or manage, we’ve got the tools you need.
      </p>
    </div>
  );
}
