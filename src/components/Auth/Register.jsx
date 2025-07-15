import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Confetti from "react-confetti";

const Register = () => {
  const { createUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("worker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth / 2, // Confetti on left half
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setPhotoFile(image);
    const form = new FormData();
    form.append("image", image);

    const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${imgBBKey}`;

    try {
      const res = await axios.post(url, form);
      const imageUrl = res.data.data.url;
      setPhotoURL(imageUrl);
      toast.success("Photo uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photo");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!photoURL) {
      setError("Please upload a profile photo");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUser(email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL,
      });

      const coins = role === "buyer" ? 50 : 10;

      await axios.post(`https://mini-hive-server.vercel.app/users`, {
        name,
        email,
        photo: photoURL,
        role,
        coins,
      });

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.message || "Registration failed.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-amber-200 to-yellow-400 text-black flex flex-col justify-center items-center px-10 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center opacity-10 z-0"></div>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <div className="z-10 text-center">
          <h3 className="text-sm font-light tracking-widest uppercase">Nice to see you again</h3>
          <h1 className="text-4xl font-bold my-4">WELCOME BACK</h1>
          <p className="max-w-sm text-black/80">
            Register now and start working or hiring with ease!
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center text-yellow-600 mb-2">
            Register Account
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Fill in your details to create an account
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-3 pr-4 py-3 border-l-4 border-yellow-500 border rounded-md"
              required
            />

            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-3 pr-4 py-3 border-l-4 border-yellow-500 border rounded-md"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3 pr-4 py-3 border-l-4 border-yellow-500 border rounded-md"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border-l-4 border-yellow-500 border p-2 rounded-md"
              required
            />

            {photoURL && (
              <img
                src={photoURL}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full mx-auto"
              />
            )}

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-3 pr-4 py-3 border-l-4 border-yellow-500 border rounded-md"
            >
              <option value="worker">Worker</option>
              <option value="buyer">Buyer</option>
            </select>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-yellow-500" />
                Keep me signed in
              </label>
              <Link to="/login" className="text-yellow-600 hover:underline">
                Already a member?
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black hover:bg-yellow-500 text-white py-3 rounded-full text-sm font-semibold transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
