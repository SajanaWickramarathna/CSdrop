import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 text-gray-800">
      <Nav />

      <section className="py-16 px-6 sm:px-16 lg:px-32">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center text-blue-800">
            Terms of Service
          </h1>

          <p>
            These Terms of Service ("Terms") govern your use of the DROPship
            website and services. By accessing or using our platform, you agree
            to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            1. Use of the Site
          </h2>
          <p>
            You agree to use the site for lawful purposes only. You must not use
            our services to engage in fraudulent or illegal activity.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            2. Account Registration
          </h2>
          <p>
            You may be required to create an account to access certain features.
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            3. Orders and Payments
          </h2>
          <p>
            All purchases made on DROPship are subject to availability and
            confirmation of payment. We reserve the right to cancel or refuse
            any order at our discretion.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            4. Pricing and Product Descriptions
          </h2>
          <p>
            We aim to ensure all prices and descriptions are accurate. However,
            errors may occur, and we reserve the right to correct them without
            prior notice.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            5. Intellectual Property
          </h2>
          <p>
            All content on this site, including logos, images, and text, is the
            property of DROPship or its partners. You may not use or reproduce
            any materials without permission.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            6. Limitation of Liability
          </h2>
          <p>
            DROPship is not liable for any indirect, incidental, or
            consequential damages resulting from your use of the site or
            services.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            7. Termination
          </h2>
          <p>
            We reserve the right to terminate or suspend your access to the
            platform for violations of these Terms or any applicable laws.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            8. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of Sri Lanka. Any disputes shall be subject to the
            jurisdiction of local courts.
          </p>

          <h2 className="text-2xl font-semibold text-blue-700">
            9. Changes to Terms
          </h2>
          <p>
            We may update these Terms at any time. Continued use of the platform
            after updates constitutes acceptance of the revised Terms.
          </p>

          <p className="mt-6 italic text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
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
            className="hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            <FaFacebook className="text-2xl" /> Facebook
          </a>

          <a
            href="https://www.instagram.com/iamsaj.__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors flex items-center gap-2"
          >
            <FaInstagram className="text-2xl" /> Instagram
          </a>

          <a
            href="https://www.instagram.com/iamsaj.__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors flex items-center gap-2"
          >
            <FaXTwitter className="text-2xl" /> X
          </a>

          <a
            href="https://www.instagram.com/iamsaj.__/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors flex items-center gap-2"
          >
            <FaTiktok className="text-2xl" /> Tik tok
          </a>
        </div>

        <p>
          <Link to="/" className="text-blue-200 hover:underline">
            Home
          </Link>{" "}
          |{" "}
          <Link to="/privacypolicy" className="text-blue-200 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
