import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const HeroSection = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 text-white animate-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Cravings <span className="text-yellow-300">Satisfied</span> <br/>
              In Minutes.
            </h1>
            <p className="text-lg md:text-xl text-primary-50 mb-8 max-w-lg mx-auto md:mx-0">
              Discover the best food and drinks in your city. Get it delivered hot, fresh, and lightning fast!
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto md:mx-0">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for restaurants or dishes..." 
                className="w-full py-4 pl-12 pr-28 rounded-full text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all font-medium"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-[130px] top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                  title="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium cursor-pointer"
              >
                Find Food
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "backOut", delay: 0.2 }}
            className="hidden md:block relative"
          >
            {/* Decorative abstract shapes behind the image could go here */}
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full transform scale-110"></div>
            <img 
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Delicious burger and fries" 
              className="relative z-10 w-full rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-out border-4 border-white/20"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
