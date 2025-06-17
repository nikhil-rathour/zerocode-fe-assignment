'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to check if a route is active
  const isActiveRoute = (route: string): boolean => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname && pathname.startsWith(route)) return true;
    return false;
  };

  // Function to get navigation link classes
  const getNavLinkClasses = (route: string): string => {
    const baseClasses = "px-3 py-2 rounded-lg transition-all duration-300 relative";
    
    if (isActiveRoute(route)) {
      return `${baseClasses} text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30`;
    }
    
    return `${baseClasses} text-gray-300 hover:text-white hover:bg-white/5`;
  };

  return (
    <nav className="border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">AI + JWT</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" className={getNavLinkClasses('/')}>
                  <span className="relative z-10">About</span>
                  {isActiveRoute('/') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  )}
                </Link>
                <Link href="/home" className={getNavLinkClasses('/home')}>
                  <span className="relative z-10">Chatbot</span>
                  {isActiveRoute('/home') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* Right side - User/Auth controls */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                  <span className="text-gray-300 hidden md:inline">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center space-x-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActiveRoute('/login') 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActiveRoute('/register')
                      ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}