import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const coinPackages = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

const PurchaseCoin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const API = (import.meta.env.VITE_SERVER_BASE_URL || "https://mini-hive-server.vercel.app").replace(/\/+$/, '');

  const handleBuy = async (coins, price) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true);

      const res = await axios.post(
        `${API}/purchase-coin`,
        {
          email: user.email,
          name: user.displayName,
          coins,
          amount: price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("🎉 Coin purchase successful!");
      navigate("/dashboard/payment-history");
    } catch (err) {
      console.error(err);
      toast.error("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-yellow-600 text-center mb-10">
        💰 Purchase Coins
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coinPackages.map((pkg, idx) => (
          <div
            key={idx}
            className="border border-yellow-300 p-6 rounded-xl shadow hover:shadow-lg transition-all bg-white"
          >
            <h3 className="text-2xl font-semibold text-center text-blue-700 mb-2">
              {pkg.coins} Coins
            </h3>
            <p className="text-center text-gray-600 mb-4 text-lg font-medium">
              = ${pkg.price}
            </p>
            <button
              onClick={() => handleBuy(pkg.coins, pkg.price)}
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseCoin;
