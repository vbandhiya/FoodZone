import React from 'react';
import { Star, Clock, AlertCircle, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFavorite = favorites.includes(restaurant.id);
  const isAdmin = currentUser?.role === 'admin';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.info("Please login to favorite restaurants");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    toggleFavorite(restaurant.id);
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {restaurant.cuisine || "Various"}
          </span>
          {isAdmin && (
            <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 border border-gray-800">
              <ShieldCheck className="w-3 h-3 text-primary-400" /> ADMIN VIEW
            </span>
          )}
        </div>
        {!isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg scale-110' 
                  : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110 shadow-sm'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            {!restaurant.isOpen && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Closed
              </span>
            )}
          </div>
        )}
        {isAdmin && !restaurant.isOpen && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Closed
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">{restaurant.rating || "New"}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {restaurant.description || "Fresh and delicious food made with love. Order now!"}
        </p>
        
        <div className="mt-auto flex items-center justify-between text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{restaurant.deliveryTime || "30-45"} min</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
            <span>&#8377; {restaurant.costForTwo || 300} for two</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
