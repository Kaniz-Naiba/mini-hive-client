import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const WithdrawalRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const API = (import.meta.env.VITE_SERVER_BASE_URL || "https://mini-hive-server.vercel.app").replace(/\/+$/, "");

  
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API}/admin/withdrawals?status=pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch withdrawal requests");

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // Approve request
  const handleApprove = async (id) => {
    if (!user) return;
    setApprovingId(id);
    setError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/admin/withdrawals/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Approval failed");
      }

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message || "Approval failed");
    } finally {
      setApprovingId(null);
    }
  };

  // UI rendering
  if (loading) return <p className="text-center py-10 text-yellow-600">Loading withdrawal requests...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error: {error}</p>;
  if (requests.length === 0) return <p className="text-center py-10 text-gray-500">No pending withdrawal requests.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-600">
        🧾 Pending Withdrawal Requests
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-yellow-300 bg-white rounded-md shadow">
          <thead className="bg-yellow-100 text-yellow-800">
            <tr>
              <th className="p-2 border border-yellow-300">Worker Name</th>
              <th className="p-2 border border-yellow-300">Email</th>
              <th className="p-2 border border-yellow-300">Coins</th>
              <th className="p-2 border border-yellow-300">Amount (USD)</th>
              <th className="p-2 border border-yellow-300">Payment System</th>
              <th className="p-2 border border-yellow-300">Account Number</th>
              <th className="p-2 border border-yellow-300">Request Date</th>
              <th className="p-2 border border-yellow-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="text-center border-t border-yellow-200">
                <td className="p-2 border border-yellow-200">{req.worker_name}</td>
                <td className="p-2 border border-yellow-200">{req.worker_email}</td>
                <td className="p-2 border border-yellow-200">{req.withdrawal_coin}</td>
                <td className="p-2 border border-yellow-200">${req.withdrawal_amount.toFixed(2)}</td>
                <td className="p-2 border border-yellow-200 capitalize">{req.payment_system}</td>
                <td className="p-2 border border-yellow-200">{req.account_number}</td>
                <td className="p-2 border border-yellow-200">
                  {new Date(req.withdraw_date).toLocaleString()}
                </td>
                <td className="p-2 border border-yellow-200">
                  <button
                    onClick={() => handleApprove(req._id)}
                    disabled={approvingId === req._id}
                    className={`px-4 py-1 rounded text-sm text-white font-medium transition ${
                      approvingId === req._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {approvingId === req._id ? "Approving..." : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalRequests;
