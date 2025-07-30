import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import Footer from "../components/footer";
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

      <Footer />
    </div>
  );
}