import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo 4.png";
import ProfileIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import CartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "../api";
import { useCart } from "../context/CartContext";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const { cartCount, fetchCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get(
          "/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(userResponse.data);

        const notificationsResponse = await api.get(
          `/notifications/user/${userResponse.data.user_id}`
        );
        setNotificationCount(notificationsResponse.data.length || 0);

        await fetchCartCount();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token) {
      fetchData();
    } else {
      setUserData(null);
      setNotificationCount(0);
    }
  }, [token, fetchCartCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
    setIsOpen(false); // Close mobile menu on logout
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold" onClick={closeMenu}>
            <img src={Logo} alt="CS Logo" className="w-32 h-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "text-purple-700 bg-purple-50 font-semibold"
                  : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
              } transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/shop")
                  ? "text-purple-700 bg-purple-50 font-semibold"
                  : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
              } transition-colors duration-200`}
            >
              Shop
            </Link>
            <Link
              to="/contactform"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/contactform")
                  ? "text-purple-700 bg-purple-50 font-semibold"
                  : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
              } transition-colors duration-200`}
            >
              Contact Us
            </Link>

            {!token ? (
              <>
                <Link
                  to="/signin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/signin")
                      ? "text-purple-700 bg-purple-50 font-semibold"
                      : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                  } transition-colors duration-200`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
                >
                  <NotificationsIcon className="text-gray-700 hover:text-purple-700" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
                >
                  <CartIcon className="text-gray-700 hover:text-purple-700" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to={
                      userData?.role === "admin"
                        ? "/admin-dashboard"
                        : userData?.role === "customer_supporter"
                        ? "/support-dashboard"
                        : "/customer-dashboard"
                    }
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-700 transition-colors duration-200"
                  >
                    <ProfileIcon />
                    <span className="text-sm font-medium">
                      {userData?.firstName || "Account"}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogoutIcon />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            {token && (
              <div className="flex items-center mr-4 space-x-3">
                <Link to="/notifications" className="relative">
                  <NotificationsIcon className="text-gray-700" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative">
                  <CartIcon className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <CloseIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "text-purple-700 bg-purple-50 font-semibold"
                : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
            }`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/shop")
                ? "text-purple-700 bg-purple-50 font-semibold"
                : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
            }`}
          >
            Shop
          </Link>
          <Link
            to="/contactform"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/contactform")
                ? "text-purple-700 bg-purple-50 font-semibold"
                : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
            }`}
          >
            Contact Us
          </Link>

          {!token ? (
            <>
              <Link
                to="/signin"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/signin")
                    ? "text-purple-700 bg-purple-50 font-semibold"
                    : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="block px-4 py-2 rounded-md text-base font-medium text-center bg-purple-600 text-white hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to={
                  userData?.role === "admin"
                    ? "/admin-dashboard"
                    : userData?.role === "customer_supporter"
                    ? "/support-dashboard"
                    : "/customer-dashboard"
                }
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 flex items-center"
              >
                <ProfileIcon className="mr-2" />
                My Account
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogoutIcon className="mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
