import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { useSettingsStore } from './store/settingsStore';
import { useAuth } from './context/AuthContext';
import { useDataStore } from './store/dataStore';
// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

/* 
  ======================================================
  APP COMPONENT 
  ======================================================
  This is the main entry point of our React Application. 
  It handles routing, theming, globally loading data, and 
  protecting secure pages from unauthorized users.
*/
function App() {
  // 1. Pulling Global States (Theme, Auth, Database Cache)
  const { theme } = useSettingsStore();
  const { currentUser } = useAuth();
  const { fetchRestaurants, fetchFoods } = useDataStore();

  // 2. Initial Data Loading Hook
  // This downloads the heavy database content the very FIRST second 
  // the app opens, preventing loading screens later.
  useEffect(() => {
    fetchRestaurants();
    fetchFoods();
  }, []);

  // 3. Theme Engine
  useEffect(() => {
    // We strictly force Guests (not logged in) to see Light mode. 
    // Logged in users get their strictly customized theme.
    const activeTheme = currentUser ? theme : 'light';

    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark'); // Enables Tailwind dark: utilities
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, currentUser]);

  return (
    // The main layout wrapper
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar /> {/* Displayed on top of every page */}
      
      <main className="flex-grow">
        {/* 
          Here we define all our website's pages (URLs).
          Notice how we wrap private pages in <ProtectedRoute> 
          so random guests cannot type the URL and hack in! 
        */}
        <Routes>
          <Route path="/" element={
            <ProtectedRoute requireAuth={false} allowAdmin={false}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/restaurant/:id" element={
            <ProtectedRoute requireAuth={false} allowAdmin={false}>
              <RestaurantMenu />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute allowAdmin={false}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={
            <ProtectedRoute allowAdmin={false}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
