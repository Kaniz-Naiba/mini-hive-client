import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';


const BuyerSubmissions = () => {
  const { user } = useContext(AuthContext);
  const buyerEmail = user?.email;
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubmissions = async () => {
    if (!buyerEmail) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `http://localhost:5000/api/buyer/pending-submissions?email=${buyerEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [buyerEmail]);

  const handleApprove = async (submissionId) => {
  setActionLoading(true);
  try {
    const token = await user.getIdToken();
    const res = await fetch(
      `http://localhost:5000/buyer/submissions/${submissionId}/approve`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      
      if (result.message === "Required number of workers already fulfilled") {
        toast.warn("Approval limit reached. Required workers already fulfilled.");
      } else {
        toast.error("Error approving submission: " + result.message);
      }
      return;
    }

    toast.success("Submission approved");
    fetchSubmissions();
  } catch (error) {
    toast.error("Error approving submission: " + error.message);
  }
  setActionLoading(false);
};

 
const handleReject = async (submissionId) => {
  setActionLoading(true);
  try {
    const token = await user.getIdToken();
    const res = await fetch(
      `http://localhost:5000/buyer/submissions/${submissionId}/reject`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to reject");
    }

    toast.success("Submission rejected");
    fetchSubmissions();
  } catch (error) {
    toast.error("Error rejecting submission: " + error.message);
  }
  setActionLoading(false);
};

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Submissions</h2>

      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => {
             console.log('submission.submitted_at:', submission.submitted_at);
            // Safely parse the date or show N/A
            const date = submission.submitted_at ? new Date(submission.submitted_at) : null;
            const formattedDate =
              date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "N/A";

            return (
              <div key={submission._id} className="p-4 border rounded shadow">
                <p>
                  <strong>Task ID:</strong> {submission.task_id}
                </p>
                <p>
                  <strong>Worker:</strong> {submission.worker_name}
                </p>
                <p>
                  <strong>Status:</strong> {submission.status}
                </p>
                <p>
                  <strong>Date:</strong> {formattedDate}
                </p>

                <div className="mt-2 space-x-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleApprove(submission._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleReject(submission._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerSubmissions;
