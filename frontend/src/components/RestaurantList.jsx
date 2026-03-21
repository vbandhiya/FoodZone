import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import { motion } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';

const RestaurantList = ({ title = "Trending Restaurants", subtitle = "Discover places everyone is talking about." }) => {
  const { restaurants: globalRestaurants, isLoadingRestaurants: loading } = useDataStore();
  const [fastDelivery, setFastDelivery] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const { searchTerm, selectedCategory } = useSearch();

  // Implement the requested fallback data instantly if global fetch returns absolutely empty array
  const restaurants = (!loading && (!globalRestaurants || globalRestaurants.length === 0)) ? [
    { id: "demo-1", name: "Spicy Bites Indian", rating: 4.5, cuisine: "Indian, Curry", deliveryTime: "25-35", costForTwo: 450, isOpen: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80" },
    { id: "demo-2", name: "Luigi's Italian Pizza", rating: 4.8, cuisine: "Italian, Pizza", deliveryTime: "30-45", costForTwo: 600, isOpen: true, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80" },
    { id: "demo-3", name: "Green Bowl Gujrati", rating: 4.6, cuisine: "Gujrati, Thali", deliveryTime: "15-25", costForTwo: 300, isOpen: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
    { id: "demo-5", name: "Smash Burger Co.", rating: 4.3, cuisine: "American, Burger", deliveryTime: "20-30", costForTwo: 400, isOpen: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" }
  ] : globalRestaurants;

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.cuisine || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category mapping explicitly handles the string matching from our unique categories data shape
    const matchesCategory = selectedCategory 
      ? (r.cuisine || "").toLowerCase().includes(selectedCategory.toLowerCase())
      : true;
      
    // Fast delivery filters out items longer than 30 mins
    const isFast = r.deliveryTime?.includes("15") || r.deliveryTime?.includes("20");
    const matchesFast = fastDelivery ? isFast : true;
    
    // Rating 4.5+
    const rat = parseFloat(r.rating || 0);
    const matchesRating = topRated ? rat >= 4.5 : true;
    
    return matchesSearch && matchesCategory && matchesFast && matchesRating;
  });

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="restaurants">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
          <p className="text-gray-500 mt-2 text-lg">
            {searchTerm || selectedCategory 
              ? `Showing results for ${selectedCategory ? selectedCategory : ''} ${searchTerm ? `"${searchTerm}"` : ''}`
              : subtitle}
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setFastDelivery(!fastDelivery)}
             className={`px-4 py-2 border rounded-full text-sm font-medium transition cursor-pointer ${fastDelivery ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:bg-gray-50'}`}
           >
             Fast Delivery
           </button>
           <button 
             onClick={() => setTopRated(!topRated)}
             className={`px-4 py-2 border rounded-full text-sm font-medium transition cursor-pointer ${topRated ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:bg-gray-50'}`}
           >
             Rating 4.5+
           </button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex flex-col bg-white rounded-[2rem] shadow-sm overflow-hidden h-[340px]">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 flex-1 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
               <Link to={`/restaurant/${restaurant.id}`} className="block h-full">
                 <RestaurantCard restaurant={restaurant} />
               </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">☹️</span>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-lg text-gray-500 font-medium max-w-md mx-auto">We couldn't find any restaurants or dishes matching "{searchTerm}". Try a different search.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(null); }} 
            className="mt-6 text-primary-600 font-bold hover:underline bg-primary-50 px-6 py-2 rounded-full cursor-pointer transition-colors hover:bg-primary-100"
          >
            Clear Search
          </button>
        </div>
      )}
    </section>
  );
};

export default RestaurantList;
