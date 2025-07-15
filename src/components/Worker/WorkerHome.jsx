import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../Shared/Loader";
import { CheckCircle, FileText, Clock, DollarSign } from "lucide-react";

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-yellow-600 mb-10">
        👷 My Profile
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
