import { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const [history, setHistory] = useState([]);
  const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  useEffect(() => {
    axios.get('https://employee-attendance-3.onrender.com/api/attendance/my-history', config).then(res => setHistory(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Attendance History</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Check In</th>
              <th className="p-4 font-semibold text-gray-600">Check Out</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Hours</th>
            </tr>
          </thead>
          <tbody>
            {history.map((rec) => (
              <tr key={rec._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-gray-700">{rec.date}</td>
                <td className="p-4 text-gray-700">{new Date(rec.checkInTime).toLocaleTimeString()}</td>
                <td className="p-4 text-gray-700">{rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : '-'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.status === 'Present' ? 'bg-green-100 text-green-700' : 
                    rec.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="p-4 text-gray-700 font-mono text-sm">{rec.totalHours || '0.00'} hrs</td>
              </tr>
            ))}
            {history.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No history available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}