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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMobileMenuOpen(false);
      router.push('/login');
      window.location.reload();
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-xl bg-black/10 rounded-b-3xl shadow-lg shadow-black/20 transition-all duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group transition-all duration-500 ease-in-out">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500 ease-in-out">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-all duration-500 ease-in-out">AI + JWT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6 transition-all duration-500 ease-in-out">
              <Link href="/" className={getNavLinkClasses('/')}>
                <span className="relative z-10">Dashboard</span>
                {isActiveRoute('/') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full "></div>
                )}
              </Link>
              <Link href="/chat" className={getNavLinkClasses('/chat')}>
                <span className="relative z-10">Chatbot</span>
                {isActiveRoute('/chat') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                )}
              </Link>
            </div>
          )}

          {/* Right side - User/Auth controls */}
          <div className="flex items-center space-x-4 transition-all duration-500 ease-in-out">
            {loading ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {/* Desktop User Info */}
                <div className="hidden sm:flex items-center space-x-2 transition-all duration-500 ease-in-out">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                  <span className="text-gray-300 hidden lg:inline">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>

                {/* Desktop Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-500 ease-in-out items-center space-x-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden md:inline">Logout</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className="sm:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-500 ease-in-out"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Desktop Auth Links */}
                <div className="hidden sm:flex items-center space-x-4">
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
                </div>

                {/* Mobile Auth Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className="sm:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-500 ease-in-out"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/10 bg-black/20 backdrop-blur-xl rounded-b-3xl shadow-lg shadow-black/20 transition-all duration-500 ease-in-out">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </div>
                    <span className="text-white font-medium">
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <Link 
                    href="/" 
                    className={`block ${getNavLinkClasses('/')} w-full text-left`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/chat" 
                    className={`block ${getNavLinkClasses('/chat')} w-full text-left`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Chatbot
                  </Link>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-500 ease-in-out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Auth Links */}
                  <Link
                    href="/login"
                    className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActiveRoute('/login') 
                        ? 'text-white bg-white/10' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActiveRoute('/register')
                        ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}