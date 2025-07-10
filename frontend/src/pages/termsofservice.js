import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import { FaFacebook, FaInstagram, FaTiktok, FaChevronRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 text-gray-800">
      <Nav />

      <section className="py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <FaChevronRight className="mx-2 text-xs" />
            <span className="text-blue-600">Terms of Service</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header with decorative element */}
            <div className="bg-blue-600 px-8 py-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Terms of Service
              </h1>
              <p className="text-blue-100 mt-2">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  These Terms of Service ("Terms") govern your use of the DROPship
                  website and services. By accessing or using our platform, you agree
                  to be bound by these Terms.
                </p>

                <div className="space-y-8">
                  <section className="scroll-mt-20" id="use-of-site">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">1</span>
                      Use of the Site
                    </h2>
                    <p className="mt-3 text-gray-700">
                      You agree to use the site for lawful purposes only. You must not use
                      our services to engage in fraudulent or illegal activity.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="account-registration">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">2</span>
                      Account Registration
                    </h2>
                    <p className="mt-3 text-gray-700">
                      You may be required to create an account to access certain features.
                      You are responsible for maintaining the confidentiality of your
                      login credentials.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="orders-payments">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">3</span>
                      Orders and Payments
                    </h2>
                    <p className="mt-3 text-gray-700">
                      All purchases made on DROPship are subject to availability and
                      confirmation of payment. We reserve the right to cancel or refuse
                      any order at our discretion.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="pricing-descriptions">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">4</span>
                      Pricing and Product Descriptions
                    </h2>
                    <p className="mt-3 text-gray-700">
                      We aim to ensure all prices and descriptions are accurate. However,
                      errors may occur, and we reserve the right to correct them without
                      prior notice.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="intellectual-property">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">5</span>
                      Intellectual Property
                    </h2>
                    <p className="mt-3 text-gray-700">
                      All content on this site, including logos, images, and text, is the
                      property of DROPship or its partners. You may not use or reproduce
                      any materials without permission.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="liability">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">6</span>
                      Limitation of Liability
                    </h2>
                    <p className="mt-3 text-gray-700">
                      DROPship is not liable for any indirect, incidental, or
                      consequential damages resulting from your use of the site or
                      services.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="termination">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">7</span>
                      Termination
                    </h2>
                    <p className="mt-3 text-gray-700">
                      We reserve the right to terminate or suspend your access to the
                      platform for violations of these Terms or any applicable laws.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="governing-law">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">8</span>
                      Governing Law
                    </h2>
                    <p className="mt-3 text-gray-700">
                      These Terms shall be governed by and interpreted in accordance with
                      the laws of Sri Lanka. Any disputes shall be subject to the
                      jurisdiction of local courts.
                    </p>
                  </section>

                  <section className="scroll-mt-20" id="changes-to-terms">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
                      <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-700">9</span>
                      Changes to Terms
                    </h2>
                    <p className="mt-3 text-gray-700">
                      We may update these Terms at any time. Continued use of the platform
                      after updates constitutes acceptance of the revised Terms.
                    </p>
                  </section>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-8">
                  <Link 
                    to="/" 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto"
                  >
                    ← Back to Home
                  </Link>
                  <div className="text-sm text-gray-500 text-center sm:text-right">
                    Have questions? <Link to="/contactform" className="text-blue-600 hover:underline">Contact us</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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