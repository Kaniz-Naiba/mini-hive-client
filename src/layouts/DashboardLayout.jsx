import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, ChevronDown, Bell } from "lucide-react";
import { toast } from "react-toastify";
import React, { useContext, useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";

const DashboardLayout = () => {
  const { user, userInfo, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error(error);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.log("User not logged in yet");
          return;
        }

        const token = await currentUser.getIdToken();

        const res = await fetch("https://mini-hive-server.vercel.app/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    if (notifOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notifOpen]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = userInfo?.role || "worker";
  const coin = userInfo?.coins || 0;
  const photo = userInfo?.photo || user?.photoURL || "";
  const name = userInfo?.name || user?.displayName || "User";

  const navLinks = {
    worker: [
      { to: "/dashboard/worker-home", label: "Worker Home" },
      { to: "/dashboard/tasklist", label: "Task List" },
      { to: "/dashboard/submissions", label: "My Submissions" },
      { to: "/dashboard/withdrawals", label: "Withdrawals" },
    ],
    buyer: [
      { to: "/dashboard/buyer-home", label: "Buyer Home" },
      { to: "/dashboard/add-task", label: "Add New Task" },
      { to: "/dashboard/my-tasks", label: "My Tasks" },
      { to: "/dashboard/purchase-coin", label: "Purchase Coin" },
      { to: "/dashboard/payment-history", label: "Payment History" },
      { to: "/dashboard/buyer-submissions", label: "Pending Submissions" },
    ],
    admin: [
      { to: "/dashboard/admin-home", label: "Admin Home" },
      { to: "/dashboard/manage-users", label: "Manage Users" },
      { to: "/dashboard/manage-tasks", label: "Manage Tasks" },
      { to: "/dashboard/withdrawal-requests", label: "Withdrawal Request" },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="bg-white w-64 hidden md:flex flex-col border-r">
        <Link
          to="/"
          className="p-5 text-xl font-bold text-yellow-500 border-b block hover:text-yellow-800"
        >
          MiniHive
        </Link>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks[role]?.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-4 py-2.5 font-medium transition-all ${
                  isActive
                    ? "bg-white text-yellow-600 shadow-sm"
                    : "text-yellow-700 hover:bg-yellow-100 hover:text-yellow-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`bg-black border-r w-64 fixed h-full z-40 transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          to="/"
          className="py-6 px-10 text-xl font-bold text-yellow-500 border-b block hover:text-yellow-800"
          onClick={() => setSidebarOpen(false)} // close sidebar on click
        >
          MiniHive
        </Link>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks[role]?.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white text-yellow-700 font-semibold"
                    : "text-yellow-700 hover:bg-yellow-100 hover:text-yellow-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b">
         {/* Hamburger - Mobile Only */}
<div
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="md:hidden flex flex-col gap-[6px] cursor-pointer z-50"
>
  <span
    className={`w-6 h-0.5 bg-yellow-500 transition-transform duration-300 ${
      sidebarOpen ? "rotate-45 translate-y-2" : ""
    }`}
  />
  <span
    className={`w-6 h-0.5  bg-black transition-opacity duration-300 ${
      sidebarOpen ? "opacity-0" : ""
    }`}
  />
  <span
    className={`w-6 h-0.5  bg-yellow-500 transition-transform duration-300 ${
      sidebarOpen ? "-rotate-45 -translate-y-2" : ""
    }`}
  />
</div>

          <div className="flex items-center gap-4 relative">
            <span className="text-sm font-medium text-green-600">Coins: {coin}</span>
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-black font-semibold">{name}</span>
              <span className="text-xs text-green-400 capitalize">{role}</span>
            </div>

            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {photo ? (
                <img
                  src={photo}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center border text-gray-600 font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown size={16} />
            </div>

            <div className="relative">
              <Bell
                aria-label="Notifications"
                title="Notifications"
                className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // prevent dropdown conflict
                  setNotifOpen((prev) => !prev);
                }}
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              )}

              {notifOpen && (
                <div
                  ref={notifRef}
                  className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50"
                >
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-600">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id || notif.time}
                        className="p-3 border-b cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setNotifOpen(false);
                          if (notif.actionRoute) {
                            navigate(notif.actionRoute);
                          }
                        }}
                      >
                        <p className="text-sm">{notif.message}</p>
                        <small className="text-gray-500 text-xs">
                          {notif.time
                            ? new Date(notif.time).toLocaleString()
                            : "Unknown time"}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-14 bg-white border rounded shadow w-44 z-50">
                <div className="px-4 py-2 text-black font-medium border-b">{name}</div>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-6 ">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white text-center text-sm py-4 border-t text-gray-500">
          © {new Date().getFullYear()} MiniHive — All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
