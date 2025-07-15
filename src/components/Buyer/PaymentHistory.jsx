import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAuth } from "firebase/auth";

const PaymentHistory = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const API = (import.meta.env.VITE_SERVER_BASE_URL || "https://mini-hive-server.vercel.app").replace(/\/+$/, '');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken(true);

        const res = await fetch(`${API}/payments?email=${userInfo?.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    if (!loading && userInfo?.email) {
      fetchPayments();
    }
  }, [userInfo, loading]);

  if (loading) return <p className="text-center py-10 text-blue-600">Loading payment history...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-600 text-center">💳 Payment History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm shadow">
          <thead className="bg-yellow-100 text-yellow-900">
            <tr>
              <th className="p-3 border">Txn ID</th>
              <th className="p-3 border">Amount (USD)</th>
              <th className="p-3 border">Coins</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((pay, idx) => (
                <tr key={idx} className="text-center hover:bg-yellow-50 transition">
                  <td className="p-2 border font-mono text-gray-700">{pay._id.slice(-6)}</td>
                  <td className="p-2 border text-green-600 font-semibold">${Number(pay.amount_usd).toFixed(2)}</td>
                  <td className="p-2 border text-blue-700">{pay.coins}</td>
                  <td className="p-2 border">{new Date(pay.payment_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
