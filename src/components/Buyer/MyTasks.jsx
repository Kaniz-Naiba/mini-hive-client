import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(
        `https://mini-hive-server.vercel.app/buyer-tasks?email=${user.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sorted = res.data.sort(
        (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
      );
      setTasks(sorted);
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user]);

  const handleDelete = async (task) => {
    const confirmed = await new Promise((resolve) => {
      toast.info(
        <div>
          <p className="font-semibold mb-2">Are you sure you want to delete this task?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                toast.dismiss();
                resolve(true);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={() => {
                toast.dismiss();
                resolve(false);
              }}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              No
            </button>
          </div>
        </div>,
        { autoClose: false, closeOnClick: false, closeButton: false }
      );
    });

    if (!confirmed) return;

    const refillAmount = task.required_workers * task.payable_amount;

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.delete(`https://mini-hive-server.vercel.app/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.patch(
        `https://mini-hive-server.vercel.app/refund-coins`,
        {
          email: user.email,
          coins: refillAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Task deleted and coins refunded");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { task_title, task_detail, submission_info } = editingTask;

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.patch(
        `https://mini-hive-server.vercel.app/tasks/${editingTask._id}`,
        { task_title, task_detail, submission_info },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Task updated successfully");
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-yellow-600">📁 My Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-yellow-100 text-yellow-800">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Detail</th>
                <th className="px-4 py-2 border">Workers</th>
                <th className="px-4 py-2 border">Pay/Worker</th>
                <th className="px-4 py-2 border">Completion</th>
                <th className="px-4 py-2 border">Submission Info</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="text-center">
                  <td className="px-4 py-2 border">{task.task_title}</td>
                  <td className="px-4 py-2 border">{task.task_detail}</td>
                  <td className="px-4 py-2 border">{task.required_workers}</td>
                  <td className="px-4 py-2 border">${task.payable_amount}</td>
                  <td className="px-4 py-2 border">{task.completion_date}</td>
                  <td className="px-4 py-2 border">{task.submission_info}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2 flex-wrap">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => setEditingTask(task)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(task)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingTask && (
        <div className="mt-6 border p-4 rounded bg-yellow-50">
          <h3 className="text-lg font-bold mb-3 text-yellow-700">✏️ Edit Task</h3>
          <form onSubmit={handleUpdate} className="space-y-2">
            <input
              type="text"
              name="task_title"
              value={editingTask.task_title}
              onChange={handleEditFieldChange}
              className="w-full border p-2 rounded"
              placeholder="Task Title"
              required
            />
            <textarea
              name="task_detail"
              value={editingTask.task_detail}
              onChange={handleEditFieldChange}
              className="w-full border p-2 rounded"
              placeholder="Task Detail"
              required
            />
            <input
              type="text"
              name="submission_info"
              value={editingTask.submission_info}
              onChange={handleEditFieldChange}
              className="w-full border p-2 rounded"
              placeholder="Submission Info"
              required
            />
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
