'use client';
import StarsCanvas from '@/components/StarsCanvas';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Session error:', error);
      }
    }
    checkSession();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarsCanvas />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
         <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
  AI ChatBot
</h1>
<p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
  Chat with our intelligent AI assistant powered by cutting-edge natural language processing. Built with Next.js, TypeScript, and secure authentication.
</p>

          
          {user ? (
            <div className="space-y-6">
              <p className="text-2xl text-white">Welcome back, {user.name || user.email}!</p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/home"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg 
                           hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                >
                 Try our AI Chat
                </Link>
            
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg 
                         hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
              >
                Let's Get Started
              </Link>
             
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="text-purple-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Authentication with JWT</h3>
            <p className="text-gray-400">
              Industry-standard encryption and session management to keep your data safe.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-pink-500 transition-all">
            <div className="text-pink-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Built with Next.js for optimal performance and seamless user experience.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all">
            <div className="text-blue-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Integration</h3>
            <p className="text-gray-400">
              Cutting-edge AI chatbot with natural language processing capabilities.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Account</h3>
              <p className="text-gray-400">Register with your email and secure password</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Explore Features</h3>
              <p className="text-gray-400">Access dashboard and AI-powered tools</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Enhance Productivity</h3>
              <p className="text-gray-400">Leverage our AI assistant for your tasks</p>
            </div>
          </div>
        </div>
        {/* About the Website */}
<div className="mt-24 bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
  <h2 className="text-2xl font-bold text-white mb-4 text-center">About This Website</h2>
  <p className="text-gray-300 text-lg leading-relaxed text-center max-w-4xl mx-auto">
    This AI chatbot platform enables users to engage in natural conversations with an intelligent assistant.
    It’s built using <span className="text-purple-400 font-semibold">Next.js</span>, <span className="text-pink-400 font-semibold">TypeScript</span>, <span className="text-blue-400 font-semibold">Tailwind CSS</span>, and secure <span className="text-yellow-400 font-semibold">JWT-based authentication</span>. 
    Users can register, log in, and interact with an AI-powered bot via a sleek and responsive UI.
  </p>
  <p className="text-gray-400 text-md mt-6 text-center">
    The chatbot is connected to the <span className="text-cyan-400 font-semibold">Gemini API</span> (or another LLM endpoint) to deliver intelligent responses in real-time. 
    Sessions are managed securely, ensuring both performance and privacy.
  </p>
</div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          {user ? (
            <Link
              href="/home"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                       rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 
                       text-lg font-semibold shadow-xl"
            >
              Try Our AI Chat Now
            </Link>
          ) : (
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                         rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 
                         text-lg font-semibold shadow-xl"
              >
                Login to Chat
              </Link>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}