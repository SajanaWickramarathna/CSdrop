import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from '../assets/logo 4.png';
import ProfileIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import CartIcon from '@mui/icons-material/ShoppingCart';
import axios from "axios";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();  // To get the current route
  const [userData, setUserData] = useState(null);
  const [cartLength, setCartLength] = useState();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);

        // After user data is set, fetch the cart length
        const cartResponse = await axios.get(`http://localhost:3001/api/cart/getcart/${userResponse.data.user_id}`);
        const length = cartResponse?.data?.items?.length || 0;
        setCartLength(length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);


  // Handle logout and redirect
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/";
  };

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 p-4 transition-all duration-300 bg-white text-blue-950 rounded-lg shadow-xl`}
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <img
            src={Logo}
            alt="KHB Logo"
            className="w-32 h-auto"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Nav Links */}
        <ul
          className={`lg:flex gap-6 lg:static absolute top-16 left-0 w-full lg:w-auto bg-blue-700 lg:bg-transparent p-4 lg:p-0 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <li>
            <Link
              to="/"
              className={`block py-2 lg:py-0 ${isActive("/") ? "text-purple-700 font-semibold" : "hover:text-purple-700"}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className={`block py-2 lg:py-0 ${isActive("/shop") ? "text-purple-700 font-semibold" : "hover:text-purple-700"}`}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/contactform"
              className={`block py-2 lg:py-0 ${isActive("/contactform") ? "text-purple-700 font-semibold" : "hover:text-purple-700"}`}
            >
              Contact Us
            </Link>
          </li>

          {/* Conditional Rendering: Login/Logout */}
          {!token ? (
            <>
              <li>
                <Link
                  to="/signin"
                  className={`block py-2 lg:py-0 ${isActive("/signin") ? "text-purple-700 font-semibold" : "hover:text-purple-700"}`}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className={`block py-2 lg:py-0 ${isActive("/signup") ? "text-purple-700 font-semibold" : "hover:text-purple-700"}`}
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              <div className="flex justify-end gap-4">
                <li>
                  <Link to="/customer-dashboard" className="block py-2 lg:py-0 hover:text-purple-700">
                    <ProfileIcon />
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="block py-2 lg:py-0 hover:text-purple-700 relative">
                    <CartIcon />
                    {cartLength > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartLength}
                      </span>
                    )}
                  </Link>
                </li>

                <li>
                   <Link to="/logout" className="block py-2 px-10 lg:py-0 hover:text-red-700">
                    <LogoutIcon />
                  </Link>
                </li>
              </div>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
