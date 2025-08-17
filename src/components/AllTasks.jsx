import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL.replace(/\/$/, "");

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/all-tasks`);
      if (Array.isArray(res.data)) setTasks(res.data);
      else setTasks([]);
    } catch (error) {
      console.error("Failed to fetch all tasks:", error);
      toast.error("Failed to fetch all tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleSort = (order) => {
    setSortOrder(order);
    const sorted = [...tasks].sort((a, b) =>
      order === "asc" ? a.payable_amount - b.payable_amount : b.payable_amount - a.payable_amount
    );
    setTasks(sorted);
  };

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">Loading tasks...</p>
    );

  if (tasks.length === 0)
    return (
      <p className="text-center mt-6 text-gray-700 dark:text-gray-300">No tasks available.</p>
    );

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-600 dark:text-yellow-400">
        🛒 All Tasks
      </h2>

      {/* Sorting Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleSort("asc")}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
            sortOrder === "asc"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-100 text-yellow-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Sort by Pay: Low → High
        </button>
        <button
          onClick={() => handleSort("desc")}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
            sortOrder === "desc"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-100 text-yellow-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Sort by Pay: High → Low
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto border border-gray-200 dark:border-gray-600">
          <thead className="bg-yellow-100 text-yellow-800 dark:bg-gray-700 dark:text-gray-200">
            <tr>
              {[
                "Title",
                "Detail",
                "Buyer",
                "Workers",
                "Pay/Worker",
                "Completion",
                "Submission Info",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr
                key={task._id}
                className={`text-center transition-colors duration-200 ${
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-yellow-50 dark:hover:bg-yellow-600/20`}
              >
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">{task.task_title}</td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">{task.task_detail}</td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">{task.buyer_name || task.buyer_email}</td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">{task.required_workers}</td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">${task.payable_amount}</td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">{task.completion_date}</td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-600">{task.submission_info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTasks;
