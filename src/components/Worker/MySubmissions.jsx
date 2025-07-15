import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerEmail, setWorkerEmail] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  
  const [sortConfig, setSortConfig] = useState({ key: 'current_date', direction: 'desc' });

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setWorkerEmail(user.email);
      } else {
        setWorkerEmail(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!workerEmail) return;

    const fetchSubmissions = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        const token = await user.getIdToken();

        const res = await fetch(`https://mini-hive-server.vercel.app/submissions?email=${workerEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error('Failed to load submissions:', err.message);
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [workerEmail]);

  const handleUpdate = (id) => {
    toast.info(`Update clicked for submission ${id}`);
  };

  
  const handleDelete = (id) => {
    toast.warn(`Delete clicked for submission ${id}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 font-semibold';
      case 'pending':
        return 'text-yellow-600 font-semibold';
      case 'rejected':
        return 'text-red-600 font-semibold';
      default:
        return '';
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubmissions = React.useMemo(() => {
    let sortableItems = [...submissions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'current_date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [submissions, sortConfig]);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = sortedSubmissions.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);

  if (loading) return <p className="text-center mt-6">Loading submissions...</p>;

  if (!workerEmail) return <p className="text-center mt-6">Please log in to view your submissions.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">My Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-600">No submissions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="cursor-pointer px-4 py-2 border border-gray-300 select-none text-center"
                    onClick={() => requestSort('task_title')}
                  >
                    Task Title
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border border-gray-300 select-none text-center"
                    onClick={() => requestSort('payable_amount')}
                  >
                    Payable Amount
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border border-gray-300 select-none text-center"
                    onClick={() => requestSort('buyer_name')}
                  >
                    Buyer Name
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border border-gray-300 select-none text-center"
                    onClick={() => requestSort('status')}
                  >
                    Status
                  </th>
                  <th
                    className="cursor-pointer px-4 py-2 border border-gray-300 select-none text-center"
                    onClick={() => requestSort('current_date')}
                  >
                    Submission Date
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((sub) => {
                  const date = sub.current_date ? new Date(sub.current_date) : null;
                  const formattedDate =
                    date && !isNaN(date.getTime()) ? date.toLocaleDateString() : 'N/A';

                  return (
                    <tr key={sub._id || sub.id} className="border-b border-gray-300 even:bg-white odd:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300 text-center">{sub.task_title}</td>
                      <td className="px-4 py-2 border border-gray-300 text-center">${sub.payable_amount}</td>
                      <td className="px-4 py-2 border border-gray-300 text-center">{sub.buyer_name}</td>
                      <td className={`px-4 py-2 border border-gray-300 text-center ${getStatusStyle(sub.status)}`}>
                        {sub.status}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">{formattedDate}</td>
                      <td className="px-4 py-2 border border-gray-300 text-center space-x-2">
                        <button
                          onClick={() => handleUpdate(sub._id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                          disabled={actionLoading}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || actionLoading}
              className={`px-4 py-1 rounded border ${
                currentPage === 1 || actionLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              }`}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={actionLoading}
                  className={`px-4 py-1 rounded border ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || actionLoading}
              className={`px-4 py-1 rounded border ${
                currentPage === totalPages || actionLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MySubmissions;
