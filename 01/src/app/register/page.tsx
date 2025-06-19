"use client";

import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-500 ease-in-out">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 rounded-md transition-all duration-500 ease-in-out hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          >
            <svg className="w-5 h-5 mr-2 transition-all duration-500 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <Link href="/" className="flex items-center group transition-all duration-500 ease-in-out">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500 ease-in-out">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-all duration-500 ease-in-out">AI + JWT</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <AuthForm type="register" />
      </div>
    </div>
  );
} 