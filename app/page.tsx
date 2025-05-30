// app/page.tsx
import Link from 'next/link';
import { BoltIcon, CalculatorIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Example Heroicons

export default function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0"> {/* Matches structure from HTML */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to FitTrack
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your personal fitness companion to track workouts, calculate calories, and monitor progress.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {/* Workout Tracker Card */}
              <Link href="/workouts" className="block cursor-pointer bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                <div className="text-green-500 mb-4">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg> */}
                   <BoltIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Workout Tracker</h3>
                <p className="text-sm text-gray-600">Log your workouts and track your progress over time.</p>
              </Link>

              {/* Calorie Calculator Card */}
              <Link href="/calorie-calculator" className="block cursor-pointer bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                <div className="text-green-500 mb-4">
                  {/* SVG for CalculatorIcon (adjust path if different) - Using Heroicon as example */}
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg> */}
                   <CalculatorIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calorie Calculator</h3>
                <p className="text-sm text-gray-600">Calculate your daily calorie needs based on your metrics.</p>
              </Link>

              {/* Progress Dashboard Card */}
              <Link href="/progress" className="block cursor-pointer bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                <div className="text-green-500 mb-4">
                  {/* SVG for ChartBarIcon (adjust path if different) - Using Heroicon as example */}
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg> */}
                  <ChartBarIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Dashboard</h3>
                <p className="text-sm text-gray-600">Visualize your fitness journey with interactive charts.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
