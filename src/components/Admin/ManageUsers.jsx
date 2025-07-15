import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(null);
  const [deletingEmail, setDeletingEmail] = useState(null);

  const auth = getAuth();

  const fetchUsers = () => {
    setLoading(true);

    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        toast.error("Please log in to view users.");
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();

        const res = await fetch("http://localhost:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setUsers([]);
          toast.error("Failed to load users.");
          return;
        }

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetch users error:", error);
        toast.error("Error loading users.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (email, newRole) => {
    const confirm = await Swal.fire({
      title: `Change role?`,
      text: `Do you want to change ${email}'s role to "${newRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setUpdatingEmail(email);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please log in.");
        setUpdatingEmail(null);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await fetch(`http://localhost:5000/admin/users/${email}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success(`Role changed to "${newRole}"`);
        fetchUsers();
      } else {
        toast.error("Failed to change role.");
      }
    } catch (error) {
      console.error("Role update error:", error);
      toast.error("Something went wrong while changing role.");
    } finally {
      setUpdatingEmail(null);
    }
  };

  const handleRemoveUser = async (email) => {
    const confirm = await Swal.fire({
      title: "Delete user?",
      text: `Are you sure you want to remove ${email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setDeletingEmail(email);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please log in.");
        setDeletingEmail(null);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await fetch(`http://localhost:5000/admin/users/${email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("User removed successfully");
        fetchUsers();
      } else {
        toast.error("Failed to remove user.");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Something went wrong while removing user.");
    } finally {
      setDeletingEmail(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">Manage Users</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-yellow-300 bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow">
            <thead>
              <tr className="bg-yellow-100 text-yellow-800">
                <th className="border border-yellow-300 p-2">Photo</th>
                <th className="border border-yellow-300 p-2">Name</th>
                <th className="border border-yellow-300 p-2">Email</th>
                <th className="border border-yellow-300 p-2">Role</th>
                <th className="border border-yellow-300 p-2">Coins</th>
                <th className="border border-yellow-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user._id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-yellow-50"} text-center border-t border-yellow-200`}
                >
                  <td className="p-2 border border-yellow-200">
                    <img
                      src={user.photo || "/default-profile.png"}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="p-2 border border-yellow-200">{user.name || "N/A"}</td>
                  <td className="p-2 border border-yellow-200">{user.email}</td>
                  <td className="p-2 border border-yellow-200">
                    <select
                      disabled={updatingEmail === user.email}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      className="border rounded px-2 py-1 text-sm capitalize"
                    >
                      <option value="admin">Admin</option>
                      <option value="buyer">Buyer</option>
                      <option value="worker">Worker</option>
                    </select>
                  </td>
                  <td className="p-2 border border-yellow-200">{user.coins}</td>
                  <td className="p-2 border border-yellow-200">
                    <button
                      disabled={deletingEmail === user.email}
                      onClick={() => handleRemoveUser(user.email)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                    >
                      {deletingEmail === user.email ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
