import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please log in to load tasks.");
        setTasks([]);
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await fetch("https://mini-hive-server.vercel.app/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      toast.error("Error loading tasks");
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    const confirm = await Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(taskId);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please log in.");
        setDeletingId(null);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await fetch(
        `https://mini-hive-server.vercel.app/api/admin/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete task");

      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Error deleting task");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="p-4 text-gray-600">Loading tasks...</p>;
  if (tasks.length === 0) return <p className="p-4 text-gray-600">No tasks found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-yellow-600">Manage Tasks</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
          <thead className="bg-yellow-100 text-yellow-800">
            <tr>
              <th className="p-3 text-left">Task Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Budget</th>
              <th className="p-3 text-center">Workers</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr
                key={task._id}
                className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-3">{task.task_title}</td>
                <td className="p-3 text-sm text-gray-700">{task.task_detail}</td>
                <td className="p-3 text-center">
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    {task.payable_amount} coins
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    {task.required_workers}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    disabled={deletingId === task._id}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded flex items-center justify-center gap-1 mx-auto transition"
                  >
                    <FaTrash />
                    {deletingId === task._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="border rounded-lg shadow p-4 bg-white">
            <h3 className="text-lg font-bold text-yellow-600 mb-2">{task.task_title}</h3>
            <p className="text-gray-700 text-sm mb-1">
              <strong>Description:</strong> {task.task_detail}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Budget:</strong>{" "}
              <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs">
                {task.payable_amount} coins
              </span>
            </p>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Workers:</strong>{" "}
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                {task.required_workers}
              </span>
            </p>
            <button
              onClick={() => handleDeleteTask(task._id)}
              disabled={deletingId === task._id}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
            >
              {deletingId === task._id ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
