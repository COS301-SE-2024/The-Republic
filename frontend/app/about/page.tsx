"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const AboutPage = () => {

  const router = useRouter();
  const features = [
    { title: "Incident Reporting", description: "Report issues with government services", icon: "🚨" },
    { title: "Data Analysis", description: "Gain insights from reported data", icon: "📊" },
    { title: "Public Discourse", description: "Engage in meaningful discussions", icon: "💬" },
    { title: "Sentiment Analysis", description: "Understand public opinion trends", icon: "🔍" },
    { title: "Visualizations", description: "View data in interactive formats", icon: "📈" },
    { title: "Anonymous Posting", description: "Share concerns privately", icon: "🕵️" },
  ];

  const goBackHome = () => {
    router.push("/"); 
  };

  return (
    <div className="bg-white text-green-900 min-h-screen flex flex-col">
      <header className="p-4 flex justify-center relative items-center">
        <motion.button 
          onClick={goBackHome}
          className={`
            absolute left-4
            flex items-center
            text-green-900 hover:text-green-700 transition duration-300
          `}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={24} className="mr-2" />
          Back 
        </motion.button>
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6 }}
        >
          <Image
            priority
            width={250}
            height={150}
            src="/images/b-logo-full-black.png"
            alt="The Republic logo"
          />
        </motion.div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ color: "#007847" }} 
          >
            Revolutionize Citizen Engagement
          </motion.h1>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Empower your voice in government services
          </motion.p>
        </section>

        {/* Project Overview */}
        <section className="bg-green-100 py-16">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-4 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ color: "#007847" }}
            >
              About The Republic
            </motion.h2>
            <motion.p 
              className="text-xl text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              The Republic aims to transform citizen engagement by providing a platform to report issues and analyze data related to government services. It fosters transparency, accountability, and better public service delivery through data analysis and visualizations.
            </motion.p>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ color: "#007847" }}
            >
              Core Features
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.2, duration: 1 }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white shadow-lg p-6 rounded-lg border border-green-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-green-900">{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-green-900 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <Image
                width={150}
                height={75}
                src="/images/b-logo-full.png"
                alt="The Republic logo"
              />
            </div>
            <div className="w-full md:w-1/3 mb-4 md:mb-0 text-center">
              <p>&copy; 2024 The Republic. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
