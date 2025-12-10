import React from "react";
import Nav from "../components/navigation";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-[#333333]">
      <Nav />

      {/* Hero Section */}
      <section className="pt-32 pb-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0A2342] mb-4">
              About <span className="text-[#D4AF37]">Kicknet</span>
            </h1>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Premium products delivered straight to your doorstep
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src="/images/about.jpg"
              alt="About Kicknet"
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-[#0A2342]">
              Our Story
            </h2>
            
            <div className="space-y-4 text-[#333333] leading-relaxed">
              <p>
                Founded in 2025, Kicknet connects customers with premium products 
                from trusted brands worldwide.
              </p>
              
              <p>
                We carefully curate every product to ensure quality and deliver 
                with exceptional service right to your doorstep.
              </p>
              
              <p>
                Thank you for being part of our journey.
              </p>
            </div>

            <Link
              to="/contactform"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0A2342] font-semibold rounded-lg hover:brightness-95 transition-all duration-300"
            >
              Contact Us
              <FaChevronRight />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}