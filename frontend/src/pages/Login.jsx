import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Side - Black Theme */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
        <div className="relative z-10 text-white text-center p-10">
          <h1 className="text-5xl font-bold mb-4">Attendance</h1>
          <p className="text-xl text-gray-300">Efficient Management. Seamless Tracking.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                placeholder="name@company.com" 
                type="email"
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                type="password" 
                placeholder="••••••••" 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md transform hover:scale-[1.02]">
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? 
            <Link to="/register" className="font-bold text-black hover:underline ml-1">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}