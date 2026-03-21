import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useSettingsStore } from '../store/settingsStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { setTheme } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signup(email, password, name);
      toast.success("Account created successfully!");
      setTheme('light'); // Enforce light mode initially upon user setup 
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Failed to sign up: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2">Join Food Zone today!</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Full Name</label>
            <input 
              type="text" required value={name} onChange={e => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 outline-none" 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Email address</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 outline-none" 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 outline-none" 
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-primary-600 hover:bg-primary-500 font-bold transition disabled:opacity-50 shadow-md text-lg"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-500 transition">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
