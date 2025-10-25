// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaChevronRight } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
  <footer className="bg-primary text-secondary py-12 space-y-4 pt-8 pb-6 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">
              Kicknet
            </h3>
            <p className="mb-4">
              Premium products delivered straight to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-secondary hover:text-accent transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-secondary hover:text-accent transition-colors"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="#"
                className="text-secondary hover:text-accent transition-colors"
              >
                <FaXTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="text-secondary hover:text-accent transition-colors"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-accent transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contactform"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="hover:text-accent transition-colors flex items-center">
                  <FaChevronRight className="text-xs mr-2" /> Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/termsofservice"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FaChevronRight className="text-xs mr-2" /> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">
              Contact Info
            </h3>
            <address className="not-italic space-y-2 text-secondary">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent" 
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +94 76 123 4567
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent" 
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@dropship.com
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray pt-8 text-center">
          <p className="text-secondary">
            &copy; {new Date().getFullYear()} Kicknet. All rights reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span>
            Developed by Sajana Wickramarathna
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;