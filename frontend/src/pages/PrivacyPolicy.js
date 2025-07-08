import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import { FaFacebook, FaInstagram, FaTiktok  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 text-gray-800">
      <Nav />

      <section className="py-16 px-6 sm:px-16 lg:px-32">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center text-blue-800">Privacy Policy</h1>

          <p>
            DROPship is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit or interact with our site.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">1. Information We Collect</h2>
          <p>
            We may collect personal data such as your name, email address, contact number, shipping address, and payment information when you register, place orders, or contact us.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">2. How We Use Your Information</h2>
          <p>
            Your information is used to process orders, improve our services, personalize your shopping experience, and communicate with you about updates or promotions.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">3. Data Security</h2>
          <p>
            We implement security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">4. Sharing Information</h2>
          <p>
            We do not sell or rent your personal data. We may share it with trusted third parties for order fulfillment, payment processing, or legal compliance.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">5. Cookies</h2>
          <p>
            We use cookies to enhance site functionality and user experience. You can control cookies through your browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us if you wish to make such requests.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">7. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Any changes will be posted on this page with the updated date.
          </p>

          <p className="mt-6 italic text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          
        </div>
      </section>

      <footer className="py-6 bg-custom-gradient text-white text-center space-y-4">
              <p>
                &copy; {new Date().getFullYear()} DROPship. All rights reserved.
                <br />
                Developed by Sajana Wickramarathna
              </p>
      
              <div className="flex justify-center gap-6 text-white text-lg">
                <a
                  href="https://www.facebook.com/profile.php?id=100073905762464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 transition-colors flex items-center gap-2"
                >
                  <FaFacebook className="text-2xl" /> Facebook
                </a>
      
                <a
                  href="https://www.instagram.com/iamsaj.__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-300 transition-colors flex items-center gap-2"
                >
                  <FaInstagram className="text-2xl" /> Instagram
                </a>
      
                <a
                  href="https://www.instagram.com/iamsaj.__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors flex items-center gap-2"
                >
                  <FaXTwitter className="text-2xl" /> X
                </a>
      
                <a
                  href="https://www.instagram.com/iamsaj.__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors flex items-center gap-2"
                >
                  <FaTiktok  className="text-2xl" /> Tik tok
                </a>
              </div>
      
              <p>
                <Link to="/" className="text-blue-200 hover:underline">
                  Home
                </Link>{" "}
                |{" "}
                <Link to="/termsofservice" className="text-blue-200 hover:underline">
                  Terms of Service
                </Link>
              </p>
            </footer>
    </div>
  );
}
