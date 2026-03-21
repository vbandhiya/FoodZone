import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import FoodItemCard from '../components/FoodItemCard';
import { useCartStore } from '../store/cartStore';
import { useDataStore } from '../store/dataStore';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const cart = useCartStore(state => state.cart || []);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  const { restaurants: globalRestaurants, foods: globalFoods, isLoadingRestaurants, isLoadingFoods } = useDataStore();

  useEffect(() => {
    if (isLoadingRestaurants || isLoadingFoods) return;
    
    // We seamlessly hook the data from our pre-fetched global store
    const localRest = globalRestaurants.find(r => r.id === id) || {
      name: "Unknown Restaurant", rating: 0, cuisine: "Various", deliveryTime: "30-45", costForTwo: 500
    };
    
    // Fallback menu dummy block if the global store doesn't connect but user expects UI
    const defaultDummyMenu = [
      { id: "f1", name: "Butter Chicken", price: 350, isVeg: false, description: "Rich and creamy tomato curry", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80", restaurantId: "demo-1" },
      { id: "f4", name: "Margherita Pizza", price: 299, isVeg: true, description: "Classic cheese and tomato base", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80", restaurantId: "demo-2" }
    ];

    let localMenu = globalFoods.filter(f => f.restaurantId === id);
    if (localMenu.length === 0 && globalFoods.length > 0) {
      localMenu = globalFoods.slice(0, 5); // Fallback soft load
    } else if (localMenu.length === 0 && globalFoods.length === 0) {
      localMenu = defaultDummyMenu;
    }

    setRestaurant(localRest);
    setMenu(localMenu);
    setLoading(false);
  }, [id, globalRestaurants, globalFoods, isLoadingRestaurants, isLoadingFoods]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20 animate-pulse">
        <div className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 max-w-4xl mx-auto h-40"></div>
        <div className="max-w-4xl mx-auto px-4 mt-8 h-96 bg-white rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Restaurant Header */}
      <div className="bg-white border-b border-gray-200 pt-6 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold cursor-pointer w-fit p-2 -ml-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" /> Back to Search
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{restaurant?.name}</h1>
          <p className="text-gray-500 mb-4">{restaurant?.cuisine}</p>
          
          <div className="flex flex-wrap gap-4 items-center text-sm font-medium">
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span>{restaurant?.rating || 'New'}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{restaurant?.deliveryTime} mins</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <span>&#8377; {restaurant?.costForTwo || 300} for two</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.map(item => (
            <FoodItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Floating Checkout Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-extrabold text-xl text-gray-900">{totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added</p>
              <p className="text-sm font-semibold text-gray-500">Subtotal: &#8377; {totalPrice}</p>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-primary-500/30 active:scale-95 flex items-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
