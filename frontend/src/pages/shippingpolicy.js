import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import { FaFacebook, FaInstagram, FaTiktok, FaChevronRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function PrivacyPolicy() {
  // Policy sections data for better maintainability
  const policySections = [
    {
      title: "1. Information We Collect",
      content: "We may collect personal data such as your name, email address, contact number, shipping address, and payment information when you register, place orders, or contact us."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your information is used to process orders, improve our services, personalize your shopping experience, and communicate with you about updates or promotions."
    },
    {
      title: "3. Data Security",
      content: "We implement industry-standard security measures including encryption and secure protocols to protect your personal data from unauthorized access, disclosure, alteration, or destruction."
    },
    {
      title: "4. Sharing Information",
      content: "We do not sell or rent your personal data. We may share it only with trusted third-party service providers for essential functions like order fulfillment, payment processing, or when required by law."
    },
    {
      title: "5. Cookies and Tracking",
      content: "We use cookies and similar technologies to enhance site functionality, analyze usage patterns, and personalize your experience. You can manage cookie preferences through your browser settings."
    },
    {
      title: "6. Your Rights",
      content: "You have rights to access, correct, or delete your personal information. You may also object to processing or request data portability. Contact our Data Protection Officer at privacy@dropship.com for such requests."
    },
    {
      title: "7. Policy Updates",
      content: "We may update this policy periodically to reflect changes in our practices or legal requirements. Significant changes will be notified through our website or email when appropriate."
    },
    {
      title: "8. Contact Us",
      content: "For privacy-related inquiries or concerns, please contact our privacy team at privacy@dropship.com or through our contact form."
    }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook className="text-2xl" />,
      url: "https://www.facebook.com/profile.php?id=100073905762464",
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-2xl" />,
      url: "https://www.instagram.com/iamsaj.__/",
      color: "hover:text-pink-500"
    },
    {
      name: "Twitter",
      icon: <FaXTwitter className="text-2xl" />,
      url: "https://twitter.com/iamsaj__",
      color: "hover:text-black"
    },
    {
      name: "TikTok",
      icon: <FaTiktok className="text-2xl" />,
      url: "https://www.tiktok.com/@iamsaj__",
      color: "hover:text-black"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 text-gray-800 flex flex-col">
      <Nav />

      <main className="flex-grow">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with decorative element */}
            <div className="bg-blue-700 px-8 py-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                Privacy Policy
              </h1>
            </div>

            <div className="p-8 space-y-8">
              <p className="text-lg leading-relaxed">
                DROPship is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our services. By accessing or using our platform, you agree to the terms outlined below.
              </p>

              {/* Policy sections */}
              <div className="space-y-8">
                {policySections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h2 className="text-xl font-semibold text-blue-700">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Effective date */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  Effective Date: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

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