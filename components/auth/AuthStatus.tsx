'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthStatus() {
  const { user, loading, logout, clearAllSessions } = useAuth();

  if (loading) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex items-center space-x-3">
      {user ? (
        <>
          <span className="text-sm text-gray-300 hidden sm:inline">
            {user.profile?.username || user.email?.split('@')[0]}
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors"
          >
            Logout
          </button>
          <button
            onClick={clearAllSessions}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-2 rounded-md transition-colors"
          >
            Clear All
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-gray-300 hover:text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors hover:bg-gray-700">
            Log In
          </Link>
          <Link href="/signup" className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
} 