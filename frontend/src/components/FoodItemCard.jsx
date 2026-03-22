import React from 'react';
import { Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const FoodItemCard = ({ item }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCartStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItem = cart.find(c => c.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isAdmin = currentUser?.role === 'admin';

  const handleAdd = () => {
    if (!currentUser) {
      toast.info("Please login to add items to your cart");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    addToCart(item);
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-4 gap-4 hover:shadow-md transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-4 h-4 rounded-sm flex items-center justify-center border ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
          </span>
          <h3 className="font-bold text-gray-900">{item.name}</h3>
        </div>
        <p className="font-semibold text-gray-800 mb-2">&#8377; {item.price}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex flex-col items-center justify-center relative w-32 h-32 flex-shrink-0">
        <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"} alt={item.name} loading="lazy" className="w-full h-full object-cover rounded-xl" />
        
        {isAdmin ? (
          <div className="absolute -bottom-3 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 border border-gray-800">
            <ShieldCheck className="w-3 h-3 text-primary-400" /> ADMIN MODE
          </div>
        ) : quantity === 0 ? (
          <button 
            onClick={handleAdd} 
            className="absolute -bottom-3 bg-white text-primary-600 border border-gray-200 shadow-sm font-bold px-6 py-1.5 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            ADD <Plus className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute -bottom-3 bg-white border border-gray-200 shadow-sm font-bold rounded-lg flex items-center overflow-hidden h-9">
            <button 
              onClick={() => quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)}
              className="px-3 h-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-2 text-primary-600 min-w-[28px] text-center">{quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, 1)}
              className="px-3 h-full text-gray-500 hover:bg-gray-100 hover:text-green-500 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItemCard;
