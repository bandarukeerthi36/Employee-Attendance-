import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { LayoutDashboard, Users, FileText, LogOut, UserCircle } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = user.role === 'manager' ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employee Stats', path: '/stats', icon: Users },
    { name: 'Reports', path: '/reports', icon: FileText },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My History', path: '/history', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#F4F6F8]">
      {/* Sidebar */}
      <div className="w-64 bg-white flex flex-col border-r border-gray-200">
        <div className="p-6 flex items-center space-x-2">
          {/* Logo Icon - Black */}
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
          {/* App Name - Attendance */}
          <span className="text-xl font-bold text-gray-900">Attendance</span>
        </div>

        <div className="px-4 mb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-black text-white shadow-lg shadow-gray-400' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm font-medium w-full">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}