import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../Shared/Loader";
import { CheckCircle, FileText, Clock, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const WorkerHome = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [workerData, setWorkerData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchWorkerData = async () => {
      try {
        const res = await axiosSecure.get(`/api/worker/home?email=${user.email}`);
        setWorkerData(res.data);
      } catch (err) {
        console.error("Error fetching worker home data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [user?.email, axiosSecure]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  const {
    totalSubmission,
    totalPendingSubmission,
    totalEarning,
    coins,
    approvedSubmissions,
  } = workerData;

  // Chart data
  const chartData = [
    { name: "Total Submissions", value: totalSubmission },
    { name: "Pending Submissions", value: totalPendingSubmission },
    { name: "Total Earnings", value: totalEarning },
    { name: "Coins", value: coins },
  ];

  const barColors = ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6"]; // yellow, blue, green, purple

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">
      <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">
        👷 Welcome {user.displayName || user.name || "Worker"}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<FileText className="text-yellow-600" size={28} />}
          title="Total Submissions"
          value={totalSubmission}
          valueColor="text-yellow-600"
        />
        <SummaryCard
          icon={<Clock className="text-yellow-600" size={28} />}
          title="Pending Submissions"
          value={totalPendingSubmission}
          valueColor="text-yellow-600"
        />
        <SummaryCard
          icon={<DollarSign className="text-green-600" size={28} />}
          title="Total Earnings"
          value={`${totalEarning} Coins`}
          valueColor="text-green-600"
        />
        <SummaryCard
          icon={<CheckCircle className="text-purple-600" size={28} />}
          title="Your Coins"
          value={`${coins} Coins`}
          valueColor="text-purple-600"
        />
      </div>

      {/* Overview Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">Overview Chart</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#374151" }} />
            <YAxis tick={{ fontSize: 14, fill: "#374151" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", color: "#fff" }}
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50} label={{ position: "top", fill: "#374151", fontWeight: "bold" }}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Approved Submissions */}
      <div>
        <h3 className="text-2xl font-semibold text-yellow-600 mb-4">✅ Approved Submissions</h3>
        {approvedSubmissions.length === 0 ? (
          <p className="text-gray-600">No approved submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {approvedSubmissions.map((sub, index) => (
              <div
                key={index}
                className="p-5 border border-yellow-300 bg-gradient-to-r from-white to-yellow-50 rounded-lg shadow"
              >
                <h4 className="text-lg font-bold text-yellow-700">{sub.task_title}</h4>
                <p className="text-sm text-gray-600">👤 Buyer: {sub.buyer_name}</p>
                <p className="text-sm text-green-600 font-semibold">
                  💰 Payable: {sub.payable_amount} coins
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, valueColor }) => (
  <div className="bg-white border border-gray-100 shadow-md rounded-xl p-5 text-center hover:shadow-lg transition-all">
    <div className="flex justify-center mb-3">{icon}</div>
    <h4 className="text-sm text-gray-500 font-medium">{title}</h4>
    <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
  </div>
);

export default WorkerHome;
