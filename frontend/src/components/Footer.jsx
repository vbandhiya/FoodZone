import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-primary-500">Food Zone</h3>
            <p className="text-gray-400 max-w-sm">
              Delivering happiness to your doorstep. Order from your favorite restaurants and get hot food delivered fast!
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/restaurants" className="hover:text-primary-400 transition-colors">Restaurants</a></li>
              <li><a href="/offers" className="hover:text-primary-400 transition-colors">Offers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Contact Us</h4>
            <p className="text-gray-400">support@foodzone.com</p>
            <p className="text-gray-400 mt-2">1-800-FOOD-ZON</p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Food Zone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
