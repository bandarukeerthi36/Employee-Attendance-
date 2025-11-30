import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Briefcase, Hash } from 'lucide-react';

export default function EmployeeStats() {
  const [attendance, setAttendance] = useState([]);

  // Define vibrant colors for avatars
  const AVATAR_COLORS = [
    'bg-indigo-500', 
    'bg-emerald-500', 
    'bg-amber-500', 
    'bg-red-500', 
    'bg-blue-500', 
    'bg-purple-500',
    'bg-pink-500'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://employee-attendance-1-35xc.onrender.com//api/attendance/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setAttendance(res.data));
  }, []);

  // Extract unique employees
  const uniqueEmployees = Array.from(new Set(attendance.map(a => a.userId?._id)))
    .map(id => {
      const rec = attendance.find(a => a.userId._id === id);
      return rec ? rec.userId : null;
    }).filter(e => e !== null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Employees</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueEmployees.map((emp, index) => {
          // Cycle through colors based on index
          const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
          
          return (
            <div key={emp._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center space-x-4 mb-4">
                {/* Colorful Avatar */}
                <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-xl`}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{emp.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">{emp.role}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-3">
                  <Briefcase size={16} className="text-gray-400" /> <span>{emp.department || 'No Dept'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" /> <span>{emp.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Hash size={16} className="text-gray-400" /> <span>{emp.employeeId || 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}
        {uniqueEmployees.length === 0 && <p className="text-gray-500">No employee data found in records.</p>}
      </div>
    </div>
  );
}