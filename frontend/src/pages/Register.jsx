import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', employeeId: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://employee-attendance-1-35xc.onrender.com//api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      navigate('/');
    } catch (err) { alert('Error registering.'); }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Side - Black Theme */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-90"></div>
        <div className="relative z-10 text-white text-center p-10">
          <h1 className="text-5xl font-bold mb-4">Join the Team</h1>
          <p className="text-xl text-gray-300">Start tracking your productivity today.</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-black" onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-black" type="email" onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-black" type="password" onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <input className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-black" onChange={e => setFormData({...formData, department: e.target.value})} required />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Employee ID</label>
                    <input className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-black" placeholder="e.g. EMP001" onChange={e => setFormData({...formData, employeeId: e.target.value})} required />
                </div>
            </div>

            <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition shadow-md mt-4">
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? 
            <Link to="/" className="font-bold text-black hover:underline ml-1">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}