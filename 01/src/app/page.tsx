'use client';

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
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mt-10">
          <h1 className="text-3xl font-bold mb-6">Welcome to the Auth App</h1>
          <p className="mb-4">
            This is a simple authentication system built with Next.js and TypeScript.
          </p>
          {user ? (
            <div className="space-y-4">
              <p className="text-lg">Welcome back, {user.name || user.email}!</p>
              <Link
                href="/home"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}