'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Session error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Home Page</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">Hello, {user.name || user.email}!</p>
          <p>You are now logged in and can access this protected page.</p>
        </div>
      </div>
    </div>
  );
}