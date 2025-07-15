import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
      } else {
        setUserToken(null);
        setTasks([]);
      }
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    if (!userToken) return;

    const API_BASE = import.meta.env.VITE_SERVER_BASE_URL?.replace(/\/+$/, '') || 'https://mini-hive-server.vercel.app';

    fetch(`${API_BASE}/worker/tasks`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error('Failed to load tasks:', err.message);
      });
  }, [userToken]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-yellow-600">Available Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No tasks available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.task_title}</h3>
              <p>
                <span className="font-medium text-gray-600">Buyer:</span> {task.buyer_name}
              </p>
              <p>
                <span className="font-medium text-gray-600">Completion Date:</span>{' '}
                {new Date(task.completion_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-gray-600">Payable Amount:</span> ${task.payable_amount}
              </p>
              <p>
                <span className="font-medium text-gray-600">Required Workers:</span> {task.required_workers}
              </p>
              <button
                onClick={() => navigate(`/dashboard/tasks/${task._id}`)}
                className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md font-medium transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
