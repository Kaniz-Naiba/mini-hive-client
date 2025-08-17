import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";


const BuyerHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalTasks: 0, pendingWorkers: 0, totalPayments: 0 });
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = (import.meta.env.VITE_SERVER_BASE_URL || "https://mini-hive-server.vercel.app").replace(/\/+$/, "");

  const fetchData = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true);

      const res = await axios.get(`${API}/api/buyer/stats?email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        totalTasks: res.data.totalTasks ?? 0,
        pendingWorkers: res.data.pendingWorkers ?? 0,
        totalPayments: res.data.totalPayments ?? 0,
      });

      const subRes = await axios.get(`${API}/api/buyer/pending-submissions?email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmissions(Array.isArray(subRes.data) ? subRes.data : []);
    } catch (err) {
      console.error("BuyerHome fetch error:", err);
      toast.error("Failed to load buyer dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchData();
  }, [user]);

  // Chart data for visualization
  const chartData = [
    { name: "Total Tasks", value: stats.totalTasks },
    { name: "Pending Workers", value: stats.pendingWorkers },
    { name: "Total Payments", value: stats.totalPayments },
  ];

  const handleApprove = async (submission) => {
    setProcessingId(submission._id);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true);
      const res = await axios.patch(
        `${API}/buyer/submissions/${submission._id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, validateStatus: () => true }
      );

      if (res.status !== 200) {
        toast.warn(res.data?.message || "Approval failed");
        return;
      }

      toast.success("Submission approved and worker rewarded");
      setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
      await fetchData();
    } catch (err) {
      toast.error("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submission) => {
    setProcessingId(submission._id);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true);
      const res = await axios.patch(
        `${API}/buyer/submissions/${submission._id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status !== 200) throw new Error("Rejection failed");

      toast.success("Submission rejected and worker slot refunded");
      setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
      await fetchData();
    } catch (err) {
      toast.error("Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) return <div className="p-6">Loading user info...</div>;
  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">
      <h2 className="text-2xl font-bold mb-6 text-yellow-600">
        👋 Welcome {user.displayName || user.name || "Buyer"}
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-yellow-100 text-yellow-700 rounded shadow text-center font-semibold">
          Total Tasks: <span className="text-xl">{stats.totalTasks}</span>
        </div>
        <div className="p-6 bg-blue-100 text-blue-700 rounded shadow text-center font-semibold">
          Pending Workers: <span className="text-xl">{stats.pendingWorkers}</span>
        </div>
        <div className="p-6 bg-green-100 text-green-700 rounded shadow text-center font-semibold">
          Total Payments: <span className="text-xl">${Number(stats.totalPayments).toFixed(2)}</span>
        </div>
      </div>

     <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">Overview Chart</h3>
  <ResponsiveContainer width="100%" height={350}>
    <BarChart
      data={chartData}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      barCategoryGap="30%"
    >
      <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" /> {/* subtle gray grid */}
      <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#374151" }} />
      <YAxis tick={{ fontSize: 14, fill: "#374151" }} />
      <Tooltip
        contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", color: "#fff" }}
        cursor={{ fill: "rgba(0,0,0,0.1)" }}
      />
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
        </linearGradient>
      </defs>
      <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50} label={{ position: "top", fill: "#374151", fontWeight: "bold" }}>
        <Cell fill="url(#grad1)" />
        <Cell fill="url(#grad2)" />
        <Cell fill="url(#grad3)" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


      {/* Pending Submissions Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-yellow-600">📋 Submissions to Review</h3>
        {submissions.length === 0 ? (
          <p className="text-gray-500">No pending submissions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300">
              <thead className="bg-yellow-100 text-yellow-800">
                <tr>
                  <th className="px-4 py-2 border">Worker</th>
                  <th className="px-4 py-2 border">Task Title</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id}>
                    <td className="px-4 py-2 border">{sub.worker_name}</td>
                    <td className="px-4 py-2 border">{sub.task_title}</td>
                    <td className="px-4 py-2 border">{sub.payable_amount} coins</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-sm text-blue-600 underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleApprove(sub)}
                        disabled={processingId === sub._id}
                        className={`bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded ${
                          processingId === sub._id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(sub)}
                        disabled={processingId === sub._id}
                        className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ${
                          processingId === sub._id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white rounded p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold mb-2 text-yellow-600">Submission Details</h4>
            <p className="whitespace-pre-wrap text-gray-800">
              {selectedSubmission.submission_details}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
