import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, Clock, AlertCircle, CheckCircle, UserX, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  
  // RESTORED COLORFUL PALETTE FOR CHARTS
  // Indigo (Employees), Emerald (Present), Amber (Late), Red (Absent)
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  useEffect(() => {
    if (user.role === 'manager') {
      fetchManagerData();
    } else {
      fetchEmployeeData();
      fetchTodayStatus();
    }
  }, []);

  const fetchManagerData = async () => {
    try {
      const res = await axios.get('https://employee-attendance-1-35xc.onrender.com//api/dashboard/manager', config);
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchEmployeeData = async () => {
    try {
      const res = await axios.get('https://employee-attendance-1-35xc.onrender.com//api/dashboard/employee', config);
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTodayStatus = async () => {
    try {
      const res = await axios.get('https://employee-attendance-1-35xc.onrender.com//api/attendance/today', config);
      setTodayStatus(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAttendance = async (type) => {
    try {
      await axios.post(`https://employee-attendance-1-35xc.onrender.com//api/attendance/${type}`, {}, config);
      fetchTodayStatus();
      fetchEmployeeData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition transform hover:-translate-y-1 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Kept Stat Card Icons colorful to match charts */}
      <div className={`p-3 rounded-xl ${color} text-white`}><Icon size={24} /></div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  if (!data) return <div className="p-8">Loading stats...</div>;

  // --- EMPLOYEE VIEW ---
  if (user.role === 'employee') {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>

        {/* 1. Action Card (Black Gradient - Keeping Branding) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-900 to-black text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-400 mb-4 md:mb-0">{new Date().toDateString()}</p>
          </div>
          
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
             {!todayStatus ? (
              <button onClick={() => handleAttendance('checkin')} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition shadow-lg">
                Check In Now
              </button>
            ) : !todayStatus.checkOutTime ? (
              <div className="flex flex-col items-center">
                <span className="text-sm mb-2 text-gray-300">Checked in at {new Date(todayStatus.checkInTime).toLocaleTimeString()}</span>
                <button onClick={() => handleAttendance('checkout')} className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg">
                  Check Out
                </button>
              </div>
            ) : (
              <div className="px-6 py-2 bg-green-500/20 rounded-lg border border-green-400/30">
                <span className="font-bold text-white flex items-center gap-2"><CheckCircle size={18}/> Workday Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Stats Grid - Colorful Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={CheckCircle} 
            label="Days Present" 
            value={data.presentDays} 
            color="bg-emerald-500" 
            onClick={() => navigate('/history')} 
          />
          <StatCard 
            icon={Clock} 
            label="Late Arrivals" 
            value={data.lateDays} 
            color="bg-amber-500" 
            onClick={() => navigate('/history')} 
          />
          <StatCard 
            icon={UserX} 
            label="Days Absent" 
            value={data.absentDays} 
            color="bg-red-500" 
            onClick={() => navigate('/history')} 
          />
          <StatCard 
            icon={Calendar} 
            label="Total Hours" 
            value={data.totalHours} 
            color="bg-indigo-500" 
            onClick={() => navigate('/history')} 
          />
        </div>
      </div>
    );
  }

  // --- MANAGER VIEW ---
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Employees" value={data.totalEmployees} color="bg-indigo-500" onClick={() => navigate('/stats')} />
        <StatCard icon={CheckCircle} label="Present Today" value={data.presentCount} color="bg-emerald-500" onClick={() => navigate('/reports')} />
        <StatCard icon={Clock} label="Late Today" value={data.lateCount} color="bg-amber-500" onClick={() => navigate('/reports')} />
        <StatCard icon={UserX} label="Absent" value={data.absentCount} color="bg-red-500" onClick={() => navigate('/reports')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart - Colorful */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Weekly Attendance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyStats}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#F3F4F6'}} />
                {/* Changed fill color to Indigo (#4F46E5) */}
                <Bar dataKey="present" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Colorful */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">By Department</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {data.departmentData.map((entry, index) => (
                      // Uses the updated COLORS array
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36}/>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}