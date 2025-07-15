import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

const AddTask = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    task_title: "",
    task_detail: "",
    required_workers: "",
    payable_amount: "",
    completion_date: "",
    submission_info: "",
    task_image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const form = new FormData();
    form.append("image", image);

    const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${imgBBKey}`;

    try {
      const res = await axios.post(url, form);
      const imageUrl = res.data.data.url;
      setFormData((prev) => ({ ...prev, task_image_url: imageUrl }));
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
    } = formData;

    const totalPayable = required_workers * payable_amount;

    const taskData = {
      task_title,
      task_detail,
      required_workers: parseInt(required_workers),
      payable_amount: parseFloat(payable_amount),
      completion_date,
      submission_info,
      task_image_url,
    };

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      const res = await axios.post(`https://mini-hive-server.vercel.app/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Task added successfully!");
      navigate("/dashboard/my-tasks");
    } catch (err) {
      console.error(err);
      if (
        err.response?.data?.message === "Not enough coins. Please purchase coins."
      ) {
        toast.warn("Not enough coins. Redirecting to Purchase Coin page.");
        navigate("/dashboard/purchase-coin");
      } else {
        toast.error("Failed to add task");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600">➕ Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="task_title"
          value={formData.task_title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="task_detail"
          value={formData.task_detail}
          onChange={handleChange}
          placeholder="Task Detail"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="required_workers"
          value={formData.required_workers}
          onChange={handleChange}
          placeholder="Required Workers"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="payable_amount"
          value={formData.payable_amount}
          onChange={handleChange}
          placeholder="Payable Amount per Worker"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="completion_date"
          value={formData.completion_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="submission_info"
          value={formData.submission_info}
          onChange={handleChange}
          placeholder="Submission Info (e.g. screenshot)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-2 rounded"
          required
        />
        {formData.task_image_url && (
          <img
            src={formData.task_image_url}
            alt="Preview"
            className="w-32 h-20 object-cover mt-2 rounded"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition"
        >
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
