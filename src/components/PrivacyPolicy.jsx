// src/components/PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-6">
        Privacy Policy
      </h1>

      <p className="mb-4">
        At MiniHive, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect personal information such as your name, email address, and payment details when you register or use our services. We also collect non-personal information like your IP address, browser type, and usage data to improve our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        Your information is used to provide and improve our services, process payments, communicate with you, and ensure security. We do not sell your personal data to third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Cookies & Tracking</h2>
      <p className="mb-4">
        We may use cookies and tracking technologies to enhance user experience, analyze trends, and monitor site performance. You can manage cookies in your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, or disclosure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@minihive.com" className="text-yellow-500 dark:text-yellow-400 underline">support@minihive.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
