import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, User, LogOut, Settings, LayoutDashboard, ShieldCheck, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const cartCount = useCartStore(state => state.cartCount());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminTheme, setAdminTheme] = useState('light');
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isAdmin = currentUser?.role === 'admin';
  const hideCartRoutes = ['/login', '/signup', '/admin'];
  const shouldShowCart = !isAdmin && !hideCartRoutes.includes(location.pathname);

  const toggleAdminTheme = () => {
    const isDark = document.documentElement.classList.toggle('admin-dark');
    setAdminTheme(isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3.5 group">
              <img src="/logo.png" alt="FoodZone Logo" className="w-11 h-11 object-cover rounded-full shadow-md border-2 border-white dark:border-gray-800 group-hover:scale-105 transition-transform duration-300" />
              <span className="font-black text-3xl tracking-tighter bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">FoodZone</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {/* Show Cart ONLY for standard Users/Guests and hide on auth pages */}
            {shouldShowCart && (
              <Link to="/cart" className="text-gray-600 hover:text-primary-600 relative transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Admin Dark Mode Toggle (Only visible strictly on /admin) */}
            {isAdmin && location.pathname === '/admin' && (
              <button 
                onClick={toggleAdminTheme}
                className="transition-colors focus:outline-none flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary-600 bg-gray-50 hover:bg-gray-100"
                title="Toggle Admin Dark Mode"
              >
                {adminTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="transition-colors focus:outline-none flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-primary-600 bg-gray-50"
              >
                {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden">
                  {currentUser ? (
                    <>
                      <div className="px-5 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                        <p className="text-sm font-black text-gray-900 truncate">{currentUser.name || "User"}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{currentUser.role} Account</p>
                      </div>
                      
                      {/* Hide Profile for Admins */}
                      {!isAdmin && (
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                      )}

                      {/* Explicit Admin Dashboard link */}
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => { logout(); setIsDropdownOpen(false); }} 
                        className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                       <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 font-bold transition-colors">
                         User Login
                       </Link>
                       <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="block px-5 py-3 text-sm text-gray-900 hover:bg-gray-50 font-black border-t border-gray-50 mt-1 transition-colors">
                         Admin Login
                       </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
