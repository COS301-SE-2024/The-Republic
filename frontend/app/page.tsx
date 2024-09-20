"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Github, Mail } from "lucide-react";

const LandingPage = () => {
  const router = useRouter();
  const features = [
    { title: "Incident Reporting", description: "Report issues with government services", icon: "🚨" },
    { title: "Data Analysis", description: "Gain insights from reported data", icon: "📊" },
    { title: "Public Discourse", description: "Engage in meaningful discussions", icon: "💬" },
    { title: "Sentiment Analysis", description: "Understand public opinion trends", icon: "🔍" },
    { title: "Visualizations", description: "View data in interactive formats", icon: "📈" },
    { title: "Anonymous Posting", description: "Share concerns privately", icon: "🕵️" },
  ];

  const handleSignUp = () => {
    router.push("/login"); 
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            priority
            width={250}
            height={150}
            src="/images/b-logo-full.png"
            alt="The Republic logo"
          />
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Revolutionize Citizen Engagement</h1>
          <p className="text-xl mb-8">Empower your voice in government services</p>
          <button 
            onClick={handleSignUp}
            className="bg-green-500 text-white px-6 py-3 rounded-full text-lg hover:bg-green-600 transition duration-300"
          >
            Sign Up Now
          </button>
        </section>

        {/* Project Overview */}
        <section className="bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">About The Republic</h2>
            <p className="text-xl text-center max-w-3xl mx-auto">
              The Republic project aims to revolutionize citizen engagement with government services by providing a platform for individuals to share their experiences, report incidents, and voice their concerns. This initiative enhances transparency and accountability within government operations.
            </p>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8">Join The Republic and help improve government services for all.</p>
            <button 
              onClick={handleSignUp}
              className="bg-white text-green-600 px-6 py-3 rounded-full text-lg hover:bg-gray-100 transition duration-300"
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-8">
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
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Connect With Us</h3>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://github.com/COS301-SE-2024/The-Republic" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-green-500"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="mailto:inifiniteloopers@gmail.com" 
                  className="text-white hover:text-green-500"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
              <p>&copy; 2024 The Republic. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
