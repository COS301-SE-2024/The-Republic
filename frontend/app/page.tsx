import React from 'react';
import { Smartphone } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full mr-2"></div>
          <span className="font-bold text-xl">The Republic</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-green-500">Home</a></li>
            <li><a href="#" className="hover:text-green-500">How it works</a></li>
            <li><a href="#" className="hover:text-green-500">Services</a></li>
            <li><a href="#" className="hover:text-green-500">Contacts</a></li>
          </ul>
        </nav>
        <button className="bg-green-500 text-white px-4 py-2 rounded-full">Download App</button>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-4">Empower Your Finances!</h1>
            <p className="text-xl mb-6">Empowering Your Financial Journey with Innovative Solutions</p>
            <button className="bg-green-500 text-white px-6 py-3 rounded-full text-lg">Get Started</button>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2 mr-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
                ))}
              </div>
              <p className="text-xl">1200+ specialists</p>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-green-500 opacity-20 blur-3xl"></div>
            <div className="relative">
              <Smartphone className="w-64 h-auto text-white mb-4" />
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Unlock Your Financial Future</h2>
                <p className="text-green-500 text-xl">Total Balance: $22,350.50</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;