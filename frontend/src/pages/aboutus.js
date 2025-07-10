import React from "react";
import Nav from "../components/navigation";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTiktok, FaChevronRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <Nav />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            About DROPship
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn more about our mission, values, and what drives us to provide
            premium products delivered straight to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src="/images/about.jpg"
              alt="About DROPship"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-gray-700 text-lg"
          >
            <p>
              Founded in 2023, DROPship started with a simple mission: to connect
              customers with premium products from trusted brands worldwide,
              delivered right to their doorstep with exceptional service.
            </p>
            <p>
              Our dedicated team carefully curates every product and brand to
              ensure quality and customer satisfaction. We believe shopping
              should be effortless, enjoyable, and reliable.
            </p>
            <p>
              Over the years, we have grown into a trusted e-commerce platform,
              serving thousands of happy customers nationwide. We are committed
              to innovation, transparency, and sustainability as we continue to
              expand.
            </p>
            <p>
              Thank you for being part of our journey. We look forward to
              serving you with the very best.
            </p>

            <Link
              to="/contactform"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">DROPship</h3>
              <p className="mb-4">
                Premium products delivered straight to your doorstep.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaXTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTiktok className="text-xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/shop" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Shop</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> About Us</Link></li>
                <li><Link to="/contactform" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link to="/shipping" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Return Policy</Link></li>
                <li><Link to="/privacypolicy" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Privacy Policy</Link></li>
                <li><Link to="/termsofservice" className="hover:text-white transition-colors flex items-center"><FaChevronRight className="text-xs mr-2" /> Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>
              <address className="not-italic space-y-2">
                <p className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Main Street, Colombo
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +94 76 123 4567
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@dropship.com
                </p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} DROPship. All rights reserved.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>
              Developed by Sajana Wickramarathna
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
