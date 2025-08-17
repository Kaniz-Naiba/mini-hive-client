// src/components/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <h1 className="text-8xl font-extrabold text-yellow-500 mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-lg">
        The page you are looking for does not exist or may have been moved. Please use the button below to return to the homepage.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
