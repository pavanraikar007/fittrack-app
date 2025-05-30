'use client';

import { useState } from 'react';

interface CalorieResults {
  bmr: number;
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  mildGain: number;
  weightGain: number;
}

export default function CalorieCalculatorPage() {
  // Form State
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>(''); // in kg
  const [height, setHeight] = useState<string>(''); // in cm
  const [activityLevel, setActivityLevel] = useState<string>('1.2'); // Default to Sedentary

  // Results State
  const [results, setResults] = useState<CalorieResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const activityOptions = [
    { label: 'Sedentary (little or no exercise)', value: '1.2' },
    { label: 'Lightly active (light exercise 1-3 days/week)', value: '1.375' },
    { label: 'Moderately active (moderate exercise 3-5 days/week)', value: '1.55' },
    { label: 'Very active (hard exercise 6-7 days/week)', value: '1.725' },
    { label: 'Extra active (very hard exercise & physical job)', value: '1.9' },
  ];

  const handleCalculateCalories = (e: React.FormEvent) => {
    e.preventDefault();

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const activityMultiplier = parseFloat(activityLevel);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      alert('Please enter valid numbers for age, weight, and height.');
      setShowResults(false);
      setResults(null);
      return;
    }

    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    const maintenance = Math.round(bmr * activityMultiplier);
    const mildLoss = maintenance - 250;
    const weightLoss = maintenance - 500;
    const mildGain = maintenance + 250;
    const weightGain = maintenance + 500;

    setResults({
      bmr: Math.round(bmr),
      maintenance,
      mildLoss,
      weightLoss,
      mildGain,
      weightGain,
    });
    setShowResults(true);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calorie Calculator</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <form onSubmit={handleCalculateCalories} className="space-y-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age (years)</label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="15" max="100" required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="30" max="300" step="0.1" required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="100" max="250" required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-700">Activity Level</label>
                  <select
                    id="activity"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    {activityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Calculate Calories
                  </button>
                </div>
              </form>
            </div>

            {/* Results Section */}
            <div>
              {showResults && results && (
                <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Daily Calorie Needs</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Basal Metabolic Rate (BMR):</span>
                      <span className="font-semibold text-gray-900">{results.bmr} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Maintenance Calories (TDEE):</span>
                      <span className="font-semibold text-gray-900">{results.maintenance} kcal</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Calories for Weight Goals:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mild weight loss (~0.25 kg/week):</span>
                        <span className="text-sm font-medium text-gray-800">{results.mildLoss} kcal</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Weight loss (~0.5 kg/week):</span>
                        <span className="text-sm font-medium text-gray-800">{results.weightLoss} kcal</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mild weight gain (~0.25 kg/week):</span>
                        <span className="text-sm font-medium text-gray-800">{results.mildGain} kcal</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Weight gain (~0.5 kg/week):</span>
                        <span className="text-sm font-medium text-gray-800">{results.weightGain} kcal</span>
                      </div>
                    </div>
                  </div>
                   <p className="mt-4 text-xs text-gray-500">
                    These are estimates. Consult with a healthcare professional for personalized advice.
                  </p>
                </div>
              )}
              {!showResults && (
                 <div className="bg-blue-50 p-6 rounded-lg shadow-sm text-center">
                    <p className="text-blue-700">Fill out the form to see your estimated daily calorie needs.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 