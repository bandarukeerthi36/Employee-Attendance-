import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import { useContext } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History'; 
import Reports from './pages/Reports'; // NEW
import EmployeeStats from './pages/EmployeeStats'; // NEW

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Employee Route */}
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          
          {/* Manager Routes */}
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><EmployeeStats /></ProtectedRoute>} />
          
          {/* Profile Placeholder */}
          <Route path="/profile" element={<ProtectedRoute><div className="p-8"><h2>Profile Page Coming Soon</h2></div></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;