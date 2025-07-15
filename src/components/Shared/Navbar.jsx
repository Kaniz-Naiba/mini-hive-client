import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { HashLink } from "react-router-hash-link";


import { Home, Info, Phone, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, userInfo, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userPhoto = userInfo?.photo || user?.photoURL || "/user-icon.png";
  const coin = userInfo?.coins || 0;

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
  <img src="/mini-hive2.png" alt="MiniHive Logo" className="h-16 w-16 object-contain" />
  <span className="text-2xl font-bold text-yellow-500">Mini<span  className="text-2xl font-bold text-black">Hive</span></span>
</Link>

        {/* Hamburger - Mobile Only */}
        <div
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-[6px] cursor-pointer z-50"
        >
          <span
            className={`w-6 h-0.5 bg-black transition-transform duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-yellow-500 transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black transition-transform duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 text-black hover:text-yellow-500">
            <Home size={18} /> Home
          </Link>
          <HashLink
            smooth
            to="/#about"
            className="flex items-center gap-1 text-black hover:text-yellow-500"
          >
            <Info size={18} /> About Us
          </HashLink>
          <HashLink
            smooth
            to="/#footer"
            className="flex items-center gap-1 text-black hover:text-yellow-500"
          >
            <Phone size={18} /> Contact Us
          </HashLink>

          {!user?.email ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Register
              </Link>
              <a
                href="https://github.com/yourusername/microtask-client"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Join as Developer
              </a>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-black hover:text-yellow-500"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <span className="text-green-600 font-semibold">
                Coins: {coin}
              </span>
              <img
                src={userPhoto}
                alt="User"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
              <a
                href="https://github.com/yourusername/microtask-client"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Join as Developer
              </a>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-3">
          <Link
            to="/"
            onClick={toggleMenu}
            className="flex items-center gap-1 text-black hover:text-yellow-500"
          >
            <Home size={18} /> Home
          </Link>
          <HashLink
            smooth
            to="/#about"
            onClick={toggleMenu}
            className="flex items-center gap-1 text-black hover:text-yellow-500"
          >
            <Info size={18} /> About Us
          </HashLink>
          <HashLink
            smooth
            to="/#footer"
            onClick={toggleMenu}
            className="flex items-center gap-1 text-black hover:text-yellow-500"
          >
            <Phone size={18} /> Contact Us
          </HashLink>

          {!user?.email ? (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block text-blue-600 hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block text-red-600 hover:underline"
              >
                Register
              </Link>
             <button
  onClick={() =>
    window.open(
      "https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Kaniz-Naiba.git",
      "_blank",
      "noopener,noreferrer"
    )
  }
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
>
  Join as Developer 
</button>

            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="flex items-center gap-1 text-black hover:text-yellow-500"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <span className="block text-green-600 font-semibold">
                Coins: {coin}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
  onClick={() =>
    window.open(
      "https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Kaniz-Naiba.git",
      "_blank",
      "noopener,noreferrer"
    )
  }
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
>
  Join as Developer 
</button>

            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
