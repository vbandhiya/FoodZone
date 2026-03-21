import React from 'react';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import RestaurantList from '../components/RestaurantList';

const Home = () => {
  return (
    <div className="pb-16 bg-gray-50">
      <HeroSection />
      <Categories />
      
      <RestaurantList />
    </div>
  );
};

export default Home;
