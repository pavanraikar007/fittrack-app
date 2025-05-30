// components/layout/Navbar.tsx
'use client'; // Add this for useState and event handlers

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // To highlight active link
import AuthStatus from '@/components/auth/AuthStatus'; // Import AuthStatus
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const baseNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/calorie-calculator', label: 'Calorie Calculator' },
  { href: '/progress', label: 'Dashboard' }, // Matched to your "Progress Dashboard" which is likely /progress
  { href: '/ai-coach', label: 'Chatbot' }, // Matched to your "AI Coach"
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useAuth(); // Get admin status

  // Add admin link only if user is admin
  const navLinks = isAdmin 
    ? [...baseNavLinks, { href: '/admin', label: 'Admin Panel' }]
    : baseNavLinks;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-green-500 font-bold text-xl">
                FitTrack
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === link.href
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:block"> {/* AuthStatus for desktop */}
              <AuthStatus />
            </div>
            <div className="-mr-2 flex items-center sm:hidden"> {/* Mobile menu button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === link.href
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-2 pt-2 pb-3 border-t border-gray-200"> {/* AuthStatus for mobile */}
            <AuthStatus />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 