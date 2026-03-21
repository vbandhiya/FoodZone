import React from 'react';
import { motion } from 'framer-motion';
import { useSearch } from '../context/SearchContext';

const categories = [
  { id: 1, name: 'Burger', image: '🍔', color: 'bg-orange-100 text-orange-600' },
  { id: 2, name: 'Pizza', image: '🍕', color: 'bg-red-100 text-red-600' },
  { id: 3, name: 'Gujrati', image: '🥗', color: 'bg-green-100 text-green-600' },
  { id: 4, name: 'Drinks', image: '🥤', color: 'bg-yellow-100 text-yellow-600' }
];

const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useSearch();

  const handleCategoryClick = (catName) => {
    setSelectedCategory(prev => prev === catName ? null : catName);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Food Categories</h2>
            <p className="text-gray-500 mt-2">What's your mood today?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] cursor-pointer shadow-sm hover:shadow-xl transition-all ${cat.color} ${selectedCategory === cat.name ? 'ring-4 ring-offset-2 ring-primary-500 scale-105' : ''}`}
            >
              <span className="text-5xl mb-4 drop-shadow-md">{cat.image}</span>
              <span className="font-bold">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
