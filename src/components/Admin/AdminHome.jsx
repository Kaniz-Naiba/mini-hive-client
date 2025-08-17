import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaUsers, FaUserTie, FaCoins, FaDollarSign } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin"); // ✅ store admin name

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("No user logged in");
        setLoading(false);
        return;
      }

      // Set display name from Firebase if exists
      setAdminName(user.displayName || "Admin");

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

        // If your backend returns admin name, prefer it
        if (data.adminName) setAdminName(data.adminName);
      } catch (error) {
        console.error(error);
        toast.error("Error loading admin stats");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-600 text-center">Loading stats...</p>;

  const cardData = [
    {
      label: "Total Workers",
      value: stats.totalWorkers,
      icon: <FaUsers size={28} />,
      bg: "from-blue-100 to-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Total Buyers",
      value: stats.totalBuyers,
      icon: <FaUserTie size={28} />,
      bg: "from-green-100 to-green-50",
      text: "text-green-700",
    },
    {
      label: "Total Coins",
      value: stats.totalCoins,
      icon: <FaCoins size={28} />,
      bg: "from-yellow-100 to-yellow-50",
      text: "text-yellow-700",
    },
    {
      label: "Total Payments",
      value: `$${stats.totalPayments}`,
      icon: <FaDollarSign size={28} />,
      bg: "from-purple-100 to-purple-50",
      text: "text-purple-700",
    },
  ];

  const chartData = [
    { name: "Workers", value: stats.totalWorkers },
    { name: "Buyers", value: stats.totalBuyers },
    { name: "Coins", value: stats.totalCoins },
    { name: "Payments", value: stats.totalPayments },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Welcome Header */}
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-600">
        👋 Welcome {adminName}
      </h2>

      {/* Stats Cards */}
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

      {/* Overview Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Overview Chart
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#374151" }} />
            <YAxis tick={{ fontSize: 14, fill: "#374151" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                color: "#fff",
              }}
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
            />
            <Bar
              dataKey="value"
              fill="url(#gradientBar)"
              radius={[10, 10, 0, 0]}
              barSize={50}
              label={{ position: "top", fill: "#374151", fontWeight: "bold" }}
            />
            <defs>
              <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                <stop offset="100%" stopColor="#fcd34d" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
