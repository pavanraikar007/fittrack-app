// lib/formulas.ts

// Fitness calculation formulas

/**
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation
 * @param gender - 'male' or 'female'
 * @param weight - weight in kilograms
 * @param height - height in centimeters
 * @param age - age in years
 * @returns BMR in calories per day
 */
export function calculateBMR(gender: 'male' | 'female', weight: number, height: number, age: number): number {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * @param bmr - Basal Metabolic Rate
 * @param activityMultiplier - Activity level multiplier
 * @returns TDEE in calories per day
 */
export function calculateTDEE(bmr: number, activityMultiplier: number): number {
  return Math.round(bmr * activityMultiplier);
}

/**
 * Activity level multipliers for TDEE calculation
 */
export const ACTIVITY_MULTIPLIERS = {
  SEDENTARY: 1.2,           // Little or no exercise
  LIGHTLY_ACTIVE: 1.375,    // Light exercise 1-3 days/week
  MODERATELY_ACTIVE: 1.55,  // Moderate exercise 3-5 days/week
  VERY_ACTIVE: 1.725,       // Hard exercise 6-7 days/week
  EXTRA_ACTIVE: 1.9         // Very hard exercise & physical job
} as const;

/**
 * Calculate calorie goals for different weight objectives
 * @param tdee - Total Daily Energy Expenditure
 * @returns Object with different calorie goals
 */
export function calculateCalorieGoals(tdee: number) {
  return {
    maintenance: tdee,
    mildLoss: tdee - 250,     // ~0.25 kg/week loss
    weightLoss: tdee - 500,   // ~0.5 kg/week loss
    mildGain: tdee + 250,     // ~0.25 kg/week gain
    weightGain: tdee + 500    // ~0.5 kg/week gain
  };
}

/**
 * Convert pounds to kilograms
 * @param pounds - weight in pounds
 * @returns weight in kilograms
 */
export function poundsToKg(pounds: number): number {
  return pounds * 0.453592;
}

/**
 * Convert feet and inches to centimeters
 * @param feet - height in feet
 * @param inches - additional inches
 * @returns height in centimeters
 */
export function feetInchesToCm(feet: number, inches: number = 0): number {
  return (feet * 12 + inches) * 2.54;
} 