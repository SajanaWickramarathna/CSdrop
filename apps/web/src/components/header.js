import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { NavLink } from "react-router-dom";
import Navigation from "./navigation";
import Logo from "../assets/logo 4.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TopHeader from './topheader';
import LoginIcon from '@mui/icons-material/Login';
import RegisterIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";




export default function Header() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  const toggleLoggedIn = (status) => {
    status === 'logout' ? setLoggedIn(true): setLoggedIn(false);  // Toggle the state directly
  };

    const [isAccountOpen, setAccountOpen] = useState(false);
    // Handle mouse enter and mouse leave for hover effect
    const handleMouseEnter = () => setAccountOpen(true); // Open dropdown on hover
    const handleMouseLeave = () => setAccountOpen(false); // Close dropdown when hover ends
  
    // State to handle hover effect (optional)
    const [toggleAccountHover, settoggleAccountHover] = useState(false);
  
    // Handle hover start and end for button
    const handleHoverEnter = () => settoggleAccountHover(true);
    const handleHoverLeave = () => settoggleAccountHover(false);

    

  return (
    <header>
        {/* Top Header */}
        <div className="topNav h-8 bg-black w-full text-white flex items-center">
          <TopHeader/>
        </div> 

        {/* Middle Header */}
        <div className="w-full h-20 bg-transparent text-black flex items-center justify-between p-6 shadow-sm">

          {/* Logo */}
          <div className="logo w-44">
            <img src={Logo} alt="logo" className="w-full h-auto" />
          </div>

          {/* Navigationa Links */}
          <Navigation />

          {/* Buttons */}
          <div className="flex flex-row items-center">
            {/* Cart Link */}
            <div>
              <NavLink
                to="/cart"
                className="relative text-lg px-4 py-2 rounded-md hover:text-blue-700 transition-all"
              >
                <ShoppingCartIcon className="mr-2" fontSize="small"/>
                <span className="absolute top-0 right-0 mt-1 mr-2 bg-red-500 text-white text-sm rounded-full px-2 py-0.5">
                  3 {/* Example cart item count */}
                </span>
              </NavLink>
            </div>

            {/* Login / Register Link */}
            <div>
              {!isLoggedIn ? (
                <div>
                  <NavLink to="./signin">
                    <button 
                      data-tooltip-id="tooltip-login"
                      data-tooltip-content="Login"
                      data-tooltip-place="bottom"
                      className="hover:bg-blue-100 text-blue-700 font-bold p-1 mx-2 border-2 border-blue-600 rounded-full transition-all">
                      
                      <Tooltip id="tooltip-login" />
                      <LoginIcon fontSize="small"/>
                    </button>
                  </NavLink>

                  <NavLink to="./signup">
                    <button 
                      data-tooltip-id="tooltip-register"
                      data-tooltip-content="Register"
                      data-tooltip-place="bottom"
                      className="hover:bg-blue-100 text-blue-700 font-bold p-1 mx-2 border-2 border-blue-600 rounded-full transition-all">
                      
                      <Tooltip id="tooltip-register" />
                      <RegisterIcon fontSize="small"/>
                    </button>
                  </NavLink>
                </div>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter} // Open on hover
                  onMouseLeave={handleMouseLeave} // Close on hover end
                >
                  <button
                    onMouseEnter={handleHoverEnter} // Handle hover on button
                    onMouseLeave={handleHoverLeave} // Handle hover off button
                    className={`flex items-center text-md px-4 py-2 transition-all ${
                      toggleAccountHover
                        ? "text-blue-700 "
                        : "hover:text-blue-950 "
                    }`}
                  >
                    <AccountCircleIcon fontSize="small" />
                    Profile
                    {isAccountOpen ? (
                      <ExpandLessIcon className="ml-2" />
                    ) : (
                      <ExpandMoreIcon className="ml-2" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountOpen && (
                    <ul className="absolute right-0 w-48 text-sm bg-white shadow-lg text-blue-950">
                      {[
                        { name: "My Profile", path: "/account/profile" },
                        { name: "Orders", path: "/account/orders" },
                        { name: "Wishlist", path: "/account/wishlist" },
                        { name: "Logout", path: "/account/logout" }  // Adding path for "Logout"
                      ].map((account) => (
                        <li key={account.name}>
                          <NavLink
                            to={account.path}
                            className="block px-4 py-2 hover:bg-blue-100 transition-all"
                          >
                            {account.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
              }
            </div>
          </div>
        </div>
    </header>
  );
}
