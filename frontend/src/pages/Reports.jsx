import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter } from 'lucide-react';

export default function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '', employee: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://employee-attendance-3.onrender.com/api/attendance/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(res.data);
      setFiltered(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    let result = attendance;
    if (filters.date) result = result.filter(r => r.date === filters.date);
    if (filters.status) result = result.filter(r => r.status === filters.status);
    if (filters.employee) result = result.filter(r => r.userId?.name.toLowerCase().includes(filters.employee.toLowerCase()));
    setFiltered(result);
  }, [filters, attendance]);

  const exportCSV = () => {
    const headers = ["Name", "Department", "Date", "Check In", "Check Out", "Status", "Hours"];
    const rows = filtered.map(r => [
      r.userId?.name,
      r.userId?.department,
      r.date,
      new Date(r.checkInTime).toLocaleTimeString(),
      r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-',
      r.status,
      r.totalHours || 0
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Reports</h1>
        {/* BLACK BUTTON */}
        <button onClick={exportCSV} className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-sm">
          <Download size={18} /> <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm text-gray-500 font-semibold">Date</label>
          <input type="date" className="block w-full border border-gray-200 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-black outline-none" 
            onChange={e => setFilters({...filters, date: e.target.value})} />
        </div>
        <div>
          <label className="text-sm text-gray-500 font-semibold">Status</label>
          <select className="block w-full border border-gray-200 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-black outline-none" 
            onChange={e => setFilters({...filters, status: e.target.value})}>
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-500 font-semibold">Employee Name</label>
          <input type="text" placeholder="Search employee..." className="block w-full border border-gray-200 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-black outline-none" 
             onChange={e => setFilters({...filters, employee: e.target.value})} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Employee</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Check In</th>
              <th className="p-4 font-semibold text-gray-600">Check Out</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec) => (
              <tr key={rec._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{rec.userId?.name}</div>
                  <div className="text-xs text-gray-500">{rec.userId?.department}</div>
                </td>
                <td className="p-4 text-gray-700">{rec.date}</td>
                <td className="p-4 text-gray-700">{new Date(rec.checkInTime).toLocaleTimeString()}</td>
                <td className="p-4 text-gray-700">{rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    rec.status === 'Present' ? 'bg-green-100 text-green-700' : 
                    rec.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No records found matching filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}