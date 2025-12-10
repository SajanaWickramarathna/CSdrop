import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navigation";
import Footer from "../components/footer";
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

      <Footer />
    </div>
  );
}