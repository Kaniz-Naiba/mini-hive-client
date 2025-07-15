import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const baseUrl = (import.meta.env.VITE_SERVER_BASE_URL || 'https://mini-hive-server.vercel.app').replace(/\/+$/, '');

function TaskDetails() {
  const { id: taskId } = useParams();
  const [task, setTask] = useState(null);
  const [worker, setWorker] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setMessage('⚠ Please login to see this page.');
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const [taskRes, profileRes] = await Promise.all([
          fetch(`${baseUrl}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${baseUrl}/users/profile?email=${user.email}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!taskRes.ok) throw new Error('Failed to fetch task');
        if (!profileRes.ok) throw new Error('Failed to fetch profile');

        const taskData = await taskRes.json();
        const profileData = await profileRes.json();

        setTask(taskData);
        setWorker(profileData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage(err.message || 'Error loading data');
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionDetails.trim()) {
      setMessage('⚠ Submission details cannot be empty.');
      return;
    }

    if (!worker || !task) {
      setMessage('⚠ User or task data missing.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const payload = {
        task_id: taskId,
        task_title: task.task_title,
        payable_amount: task.payable_amount,
        worker_email: worker.email,
        worker_name: worker.name,
        buyer_name: task.buyer_name,
        buyer_email: task.buyer_email,
        submission_details: submissionDetails,
        current_date: new Date().toISOString(),
        status: 'pending',
      };

      const res = await fetch(`${baseUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Submission sent successfully!');
        setSubmissionDetails('');
      } else {
        setMessage(data.message || data.error || '❌ Submission failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Submission failed due to network error.');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-lg text-gray-600">Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-yellow-600">Task Details</h1>

      {message && (
        <div className={`p-3 mb-4 rounded ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {task && (
        <div className="bg-gray-100 p-4 rounded-md mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{task.task_title}</h2>
          {task.task_image_url && (
            <div className="mb-4">
              <img
                src={task.task_image_url}
                alt="Task related"
                className="max-w-full h-auto rounded shadow-md"
              />
            </div>
          )}

          <p><span className="font-medium">Buyer:</span> {task.buyer_name}</p>
          <p><span className="font-medium">Completion Date:</span> {new Date(task.completion_date).toLocaleDateString()}</p>
          <p><span className="font-medium">Payable Amount:</span> ${task.payable_amount}</p>
          <p><span className="font-medium">Required Workers:</span> {task.required_workers}</p>
          <p className="mt-2"><span className="font-medium">Description:</span> {task.task_detail || 'No description'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Your Submission:</span>
          <textarea
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={5}
            value={submissionDetails}
            onChange={(e) => {
              setSubmissionDetails(e.target.value);
              setMessage('');
            }}
            disabled={submitting}
            placeholder="Enter your task submission details here..."
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-md text-white font-semibold ${
            submitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-yellow-600 hover:yellow-700'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Submission'}
        </button>
      </form>
    </div>
  );
}

export default TaskDetails;
