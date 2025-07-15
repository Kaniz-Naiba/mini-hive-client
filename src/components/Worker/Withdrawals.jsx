import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const WithdrawalForm = () => {
  const { user } = useContext(AuthContext);
  const [coins, setCoins] = useState(0); // User's current coins
  const [withdrawCoins, setWithdrawCoins] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0); // in USD
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user's coins on mount or user change
  useEffect(() => {
    if (!user?.email) return;

    // Fetch user profile or coins (adjust API endpoint accordingly)
    fetch(`http://localhost:5000/users/profile?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setCoins(data.coins || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);


  useEffect(() => {
    setWithdrawAmount(withdrawCoins / 20);
  }, [withdrawCoins]);

  const handleWithdrawCoinsChange = (e) => {
    let val = Number(e.target.value);
    if (val > coins) val = coins; 
    if (val < 0) val = 0;
    setWithdrawCoins(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (withdrawCoins < 200) {
      setMessage("Minimum withdrawal is 200 coins (10 USD).");
      return;
    }
    if (!paymentSystem) {
      setMessage("Please select a payment system.");
      return;
    }
    if (!accountNumber.trim()) {
      setMessage("Please enter your account number.");
      return;
    }

    
    const withdrawalData = {
      worker_email: user.email,
      worker_name: user.displayName || user.email,
      withdrawal_coin: withdrawCoins,
      withdrawal_amount: withdrawAmount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date(),
      status: "pending",
    };

    try {
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5000/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(withdrawalData),
      });

      if (res.ok) {
        setMessage("Withdrawal request submitted successfully!");
        // Reset form
        setWithdrawCoins(0);
        setPaymentSystem("");
        setAccountNumber("");
      } else {
        const error = await res.json();
        setMessage(error.message || "Failed to submit withdrawal.");
      }
    } catch (error) {
      setMessage("Server error, try again later.");
    }
  };

  if (loading) return <p>Loading your balance...</p>;

  if (coins < 200) {
    return <p>Insufficient coin. You need at least 200 coins to withdraw.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded shado bg-yellow-500">
      <h2 className="text-xl font-bold mb-4">Withdraw Coins</h2>
      <p>
        Current coins: <strong>{coins}</strong> (
        <em>${(coins / 20).toFixed(2)} USD</em>)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label>
            Coins to Withdraw (min 200):
            <input
              type="number"
              min="200"
              max={coins}
              value={withdrawCoins}
              onChange={handleWithdrawCoinsChange}
              className="border p-1 w-full mt-1 bg-gray-100"
              required
            />
          </label>
        </div>

        <div>
          <label>
            Withdrawal Amount (USD):
            <input
              type="number"
              value={withdrawAmount.toFixed(2)}
              readOnly
              className="border p-1 w-full mt-1 bg-gray-100"
            />
          </label>
        </div>

        <div>
          <label>
            Payment System:
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="border p-1 w-full mt-1 bg-gray-100"
              required
            >
              <option value="">-- Select Payment System --</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Account Number:
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="border p-1 w-full mt-1 bg-gray-100"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
          disabled={withdrawCoins < 200}
        >
          Withdraw
        </button>
      </form>

      {message && <p className="mt-3 text-red-600">{message}</p>}
    </div>
  );
};

export default WithdrawalForm;
