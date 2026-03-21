import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ShieldCheck, User } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db as firestoreDb } from '../firebase/config';
import { useSettingsStore } from '../store/settingsStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { login, logout } = useAuth();
  const { setTheme } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || (isAdminMode ? '/admin' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await login(email, password);
      
      // Strict Admin Check
      if (isAdminMode) {
        const userDoc = await getDoc(doc(firestoreDb, "users", userCredential.user.uid));
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          await logout();
          toast.error("Access Denied: Administrative privileges required.");
          setLoading(false);
          return;
        }
        toast.success("Admin Access Granted. Welcome back!");
        navigate('/admin');
      } else {
        const userDoc = await getDoc(doc(firestoreDb, "users", userCredential.user.uid));
        if (userDoc.exists() && userDoc.data().isBlocked) {
          await logout();
          toast.error("Account Restricted: You have been restricted by the admin.");
          setLoading(false);
          return;
        }
        toast.success("Welcome back!");
        setTheme('light'); // Enforce Light Mode on successful standard user login
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error("Authentication failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Food Zone</h2>
          <p className="text-gray-500 mt-2">{isAdminMode ? 'Authorized Personnel Only' : 'Sign in to your account'}</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${!isAdminMode ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <User className="w-4 h-4" /> User
          </button>
          <button 
            type="button"
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${isAdminMode ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Email address</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 outline-none" 
              placeholder="admin@foodzone.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 outline-none" 
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className={`w-full flex justify-center py-4 px-4 rounded-xl text-white font-bold transition-all disabled:opacity-50 shadow-lg text-lg ${isAdminMode ? 'bg-gray-900 hover:bg-black' : 'bg-primary-600 hover:bg-primary-500'}`}
          >
            {loading ? 'Authenticating...' : (isAdminMode ? 'Login as Admin' : 'Sign In')}
          </button>
        </form>

        {!isAdminMode && (
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-500 transition">Sign up</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
