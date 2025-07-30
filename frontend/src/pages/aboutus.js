import React from "react";
import Nav from "../components/navigation";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
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
      <Footer />
    </div>
  );
}
