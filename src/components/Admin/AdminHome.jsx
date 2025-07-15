import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaUsers, FaUserTie, FaCoins, FaDollarSign } from "react-icons/fa";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("No user logged in");
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch("https://mini-hive-server.vercel.app/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats({
          totalWorkers: data.totalWorkers || 0,
          totalBuyers: data.totalBuyers || 0,
          totalCoins: data.totalCoins || 0,
          totalPayments: data.totalPayments || 0,
        });
      } catch (error) {
        console.error(error);
        toast.error("Error loading admin stats");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) return <p className="p-4 text-gray-600 text-center">Loading stats...</p>;

  const cardData = [
    {
      label: "Total Workers",
      value: stats.totalWorkers,
      icon: <FaUsers size={30} />,
      bg: "from-blue-100 to-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Total Buyers",
      value: stats.totalBuyers,
      icon: <FaUserTie size={30} />,
      bg: "from-green-100 to-green-50",
      text: "text-green-700",
    },
    {
      label: "Total Coins",
      value: stats.totalCoins,
      icon: <FaCoins size={30} />,
      bg: "from-yellow-100 to-yellow-50",
      text: "text-yellow-700",
    },
    {
      label: "Total Payments",
      value: `$${stats.totalPayments}`,
      icon: <FaDollarSign size={30} />,
      bg: "from-purple-100 to-purple-50",
      text: "text-purple-700",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-yellow-500">
        Admin Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardData.map(({ label, value, icon, bg, text }, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${bg} p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-gray-700">{label}</h3>
              <div className={`${text}`}>{icon}</div>
            </div>
            <p className={`text-4xl font-bold ${text}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
