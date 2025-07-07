import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="container py-4 mx-auto px-20 flex justify-between items-center">
        
        <div className="text-xl font-bold">
          <h3>Welcome To Customer Dashboard</h3>
        </div>

        {/* Navigation Menu */}
        <ul className="flex gap-6 uppercase justify-center items-center">
          <li><Link to="/" className="hover:text-purple-400">Home</Link></li>
          <li><Link to="/shop" className="hover:text-purple-400">Shop</Link></li>
          <li><Link to="/contactform" className="hover:text-purple-400">Contact Us</Link></li>

        </ul>
      </div>
    </header>
  );
}
