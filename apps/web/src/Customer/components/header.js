import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md rounded-2xl mx-4 mt-4">
      <div className="max-w-screen-xl mx-auto py-4 px-6 flex justify-between items-center">

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">
          Welcome To Customer Dashboard
        </h3>

        {/* Navigation */}
        <nav>
          <ul className="flex gap-6 text-sm font-medium uppercase text-gray-700">
            <li>
              <Link
                to="/"
                className="px-4 py-2 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-all duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="px-4 py-2 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-all duration-200"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/contactform"
                className="px-4 py-2 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-all duration-200"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}
