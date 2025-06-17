'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50"
    >
      Logout
    </button>
  );
}