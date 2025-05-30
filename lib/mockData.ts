// lib/mockData.ts

export interface Exercise {
  id: string;
  name: string;
  type: string; // e.g., Chest, Legs, Back, Biceps, Triceps, Shoulders
  description: string;
  // muscleGroups?: string[]; // Optional: more specific muscle groups
  // equipment?: string[]; // Optional: e.g., Barbell, Dumbbell, Machine
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  category?: 'Push/Pull/Legs' | 'Upper/Lower' | 'Full Body' | 'Custom';
  exercises: Exercise[]; // Array of Exercise objects or their IDs
}

export interface ChatInteraction {
  id: string;
  question: string;
  answer: string;
}

export interface ProgressRecord {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface WorkoutLog {
  date: string; // YYYY-MM-DD
  type: string; // Name of routine or workout
  duration: number; // in minutes
  // exercisesDone?: Array<{ exerciseId: string; sets: Array<{ reps: number; weight: number }> }>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    joinDate: string; // YYYY-MM-DD
    plan: 'Free' | 'Premium' | 'Admin'; // Example plans
}

export const mockExercises: Exercise[] = [
  { id: 'ex1', name: 'Bench Press', type: 'Chest', description: 'Compound movement primarily targeting the pectoralis major, anterior deltoids, and triceps.' },
  { id: 'ex2', name: 'Squat', type: 'Legs', description: 'Compound movement targeting quads, hamstrings, glutes, and lower back.' },
  { id: 'ex3', name: 'Deadlift', type: 'Back/Legs', description: 'Compound movement working numerous muscle groups including back, legs, and core.' },
  { id: 'ex4', name: 'Overhead Press', type: 'Shoulders', description: 'Compound movement targeting deltoids, triceps, and upper chest.' },
  { id: 'ex5', name: 'Pull Up', type: 'Back/Biceps', description: 'Bodyweight exercise targeting lats, biceps, and traps.' },
  { id: 'ex6', name: 'Barbell Row', type: 'Back', description: 'Compound movement targeting lats, rhomboids, traps, and biceps.' },
  { id: 'ex7', name: 'Leg Press', type: 'Legs', description: 'Machine exercise targeting quads, hamstrings, and glutes.' },
  { id: 'ex8', name: 'Dumbbell Bicep Curl', type: 'Biceps', description: 'Isolation exercise targeting the biceps brachii.' },
  { id: 'ex9', name: 'Tricep Pushdown', type: 'Triceps', description: 'Isolation exercise targeting the triceps.' },
  { id: 'ex10', name: 'Plank', type: 'Core', description: 'Isometric exercise for core strength and stability.'}
];

export const mockRoutines: Routine[] = [
  {
    id: 'rt1',
    name: 'Push Day',
    category: 'Push/Pull/Legs',
    description: 'Focuses on chest, shoulders, and triceps.',
    exercises: [mockExercises[0], mockExercises[3], mockExercises[8]]
  },
  {
    id: 'rt2',
    name: 'Pull Day',
    category: 'Push/Pull/Legs',
    description: 'Focuses on back and biceps.',
    exercises: [mockExercises[4], mockExercises[5], mockExercises[7]]
  },
  {
    id: 'rt3',
    name: 'Leg Day',
    category: 'Push/Pull/Legs',
    description: 'Focuses on quads, hamstrings, and glutes.',
    exercises: [mockExercises[1], mockExercises[2], mockExercises[6]]
  },
  {
    id: 'rt4',
    name: 'Upper Body Blast',
    category: 'Upper/Lower',
    description: 'Comprehensive upper body workout.',
    exercises: [mockExercises[0], mockExercises[3], mockExercises[4], mockExercises[5], mockExercises[7], mockExercises[8]]
  },
  {
    id: 'rt5',
    name: 'Lower Body Power',
    category: 'Upper/Lower',
    description: 'Intense lower body workout.',
    exercises: [mockExercises[1], mockExercises[2], mockExercises[6], mockExercises[9]] // Added plank for core in lower body
  },
  {
    id: 'rt6',
    name: 'Full Body Strength',
    category: 'Full Body',
    description: 'A balanced full body workout for overall strength.',
    exercises: [mockExercises[1], mockExercises[0], mockExercises[5], mockExercises[3], mockExercises[9]]
  }
];

export const mockChatInteractions: ChatInteraction[] = [
  {
    id: 'chat1',
    question: "How can I build muscle?",
    answer: "To build muscle, focus on progressive overload in your strength training, ensure you're eating enough protein (around 1.6-2.2g per kg of body weight), and get adequate rest for recovery. A slight caloric surplus can also be beneficial."
  },
  {
    id: 'chat2',
    question: "What's a good beginner workout routine?",
    answer: "A great starting point for beginners is a full-body routine 2-3 times a week. Focus on compound movements like squats, push-ups (or knee push-ups), rows, overhead presses, and planks. Aim for 2-3 sets of 8-12 repetitions for each exercise, focusing on good form."
  },
  {
    id: 'chat3',
    question: "How much water should I drink?",
    answer: "General recommendations are about 8-10 glasses (around 2-2.5 liters) of water a day. However, your needs can increase based on activity level, climate, and individual factors. Listen to your body and drink when you're thirsty."
  },
  {
    id: 'chat4',
    question: "What are some good sources of protein?",
    answer: "Excellent sources of protein include chicken breast, fish (like salmon and tuna), lean beef, eggs, dairy products (milk, yogurt, cheese), legumes (beans, lentils), tofu, tempeh, and protein powders."
  }
];

export const mockUserProgressData = { // For a single mock user
  weight: [
    { date: '2024-06-01', value: 70 }, { date: '2024-06-08', value: 69.8 },
    { date: '2024-06-15', value: 69.5 }, { date: '2024-06-22', value: 69.6 },
    { date: '2024-07-01', value: 69.2 }, { date: '2024-07-08', value: 69.0 },
  ] as ProgressRecord[],
  calorieIntake: [ // Example daily intake for a week
    { date: '2024-07-01', value: 2200 }, { date: '2024-07-02', value: 2150 },
    { date: '2024-07-03', value: 2300 }, { date: '2024-07-04', value: 2250 },
    { date: '2024-07-05', value: 2100 }, { date: '2024-07-06', value: 2400 },
    { date: '2024-07-07', value: 2200 },
  ] as ProgressRecord[],
  workoutsLogged: [
    { date: '2024-07-01', type: 'Push Day', duration: 60 },
    { date: '2024-07-03', type: 'Pull Day', duration: 55 },
    { date: '2024-07-05', type: 'Leg Day', duration: 70 },
    { date: '2024-07-08', type: 'Push Day', duration: 65 },
  ] as WorkoutLog[]
};

export const mockAdminUsers: User[] = [
    { id: 'user1', name: 'Alice Wonderland', email: 'alice@example.com', joinDate: '2024-01-15', plan: 'Premium' },
    { id: 'user2', name: 'Bob The Builder', email: 'bob@example.com', joinDate: '2024-03-22', plan: 'Free' },
    { id: 'user3', name: 'Carol Danvers', email: 'carol@example.com', joinDate: '2023-11-01', plan: 'Admin' },
    { id: 'user4', name: 'David Copperfield', email: 'david@example.com', joinDate: '2024-05-10', plan: 'Free' },
]; 