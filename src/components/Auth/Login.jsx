import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import Confetti from "react-confetti";

const Login = () => {
  const { signIn: login, googleSignIn: googleLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Confetti window size state
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth / 2, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show confetti only for 5 seconds
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed: " + error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-amber-200 to-yellow-400 
                      text-black dark:text-white flex flex-col justify-center items-center px-10 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center opacity-10 z-0"></div>

        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        <div className="z-10 text-center relative">
          <h1 className="text-4xl font-bold my-4">WELCOME BACK</h1>
          <p className="max-w-sm text-gray-800 dark:text-gray-300">
            Login now and continue working or hiring with ease!
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center 
                      bg-white dark:bg-gray-900 px-6 py-16 transition-colors">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center text-yellow-600 dark:text-yellow-400 mb-2">
            Login to Your Account
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Prevent autofill */}
            <input type="text" name="fakeusernameremembered" className="hidden" />
            <input type="password" name="fakepasswordremembered" className="hidden" />

            <input
              type="email"
              name="login-email"
              placeholder="Email"
              autoComplete="new-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-3 pr-4 py-3 border-l-4 border-yellow-500 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 
                         text-black dark:text-white bg-white dark:bg-gray-800"
            />

            <input
              type="password"
              name="login-password"
              placeholder="Password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3 pr-4 py-3 border-l-4 border-yellow-500 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 
                         text-black dark:text-white bg-white dark:bg-gray-800"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black dark:bg-yellow-500 hover:bg-yellow-600 
                          dark:hover:bg-yellow-600 text-white dark:text-black 
                          py-3 rounded-full text-sm font-semibold transition 
                          ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 flex items-center justify-center gap-2 border-blue-500 border rounded 
                       py-3 px-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition text-gray-700 dark:text-gray-300"
          >
            <img
              src="https://i.ibb.co/v4MVCrXD/Google-Icons-09-512.webp"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">Sign in with Google</span>
          </button>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
