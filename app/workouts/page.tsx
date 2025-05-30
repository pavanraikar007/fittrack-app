'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

// Simple UUID generator for client-side use
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface LoggedWorkout {
  id: string;
  date: string;
  routineName?: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Exercise {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface Routine {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export default function WorkoutsPage() {
  const { user, loading: authLoading } = useAuth();
  
  // Form state
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [sets, setSets] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [workoutDate, setWorkoutDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Data state
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<LoggedWorkout[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch routines and exercises (public data)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .order('name');

        if (exercisesError) {
          console.error('Error fetching exercises:', exercisesError.message);
          setExercises([]);
        } else {
          setExercises(exercisesData || []);
          setAvailableExercises(exercisesData || []);
        }

        // Fetch routines (if you have a routines table)
        const { data: routinesData, error: routinesError } = await supabase
          .from('routines')
          .select('*')
          .order('name');

        if (routinesError) {
          console.error('Error fetching routines:', routinesError.message);
          setRoutines([]);
        } else {
          setRoutines(routinesData || []);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch user's workout logs
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (user) {
        setLoadingData(true);
        try {
          const { data, error } = await supabase
            .from('workout_logs')
            .select(`
              id,
              log_date,
              num_sets,
              reps_per_set,
              weight_kg,
              exercises ( name )
            `)
            .eq('user_id', user.id)
            .order('log_date', { ascending: false });

          if (error) {
            console.error('Error fetching workout logs:', error.message);
            setWorkoutHistory([]);
          } else if (data) {
            const formattedData = data.map(log => ({
              id: log.id,
              date: log.log_date,
              routineName: 'Custom', // You can enhance this if you track routines in logs
              exerciseName: (log.exercises as any)?.name || 'Unknown Exercise',
              sets: log.num_sets,
              reps: log.reps_per_set,
              weight: log.weight_kg || 0,
            }));
            setWorkoutHistory(formattedData);
          }
        } catch (error) {
          console.error('Error fetching workout logs:', error);
          setWorkoutHistory([]);
        }
        setLoadingData(false);
      } else if (!authLoading) {
        setWorkoutHistory([]);
        setLoadingData(false);
      }
    };

    if (!authLoading) {
      fetchWorkoutLogs();
    }
  }, [user, authLoading]);

  // Filter exercises based on selected routine
  useEffect(() => {
    if (selectedRoutineId) {
      // For now, since routines table might not have exercises relationship,
      // we'll show all exercises when a routine is selected
      // You can enhance this later by creating a routine_exercises junction table
      setAvailableExercises(exercises);
      setSelectedExerciseId('');
    } else {
      setAvailableExercises(exercises);
    }
  }, [selectedRoutineId, exercises]);

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedExerciseId || !sets || !reps) {
      alert('Please fill in all required fields and ensure you are logged in.');
      return;
    }

    try {
      const { error } = await supabase.from('workout_logs').insert({
        user_id: user.id,
        exercise_id: selectedExerciseId,
        log_date: workoutDate,
        num_sets: parseInt(sets),
        reps_per_set: parseInt(reps),
        weight_kg: weight ? parseFloat(weight) : null,
      });

      if (error) {
        alert('Error logging workout: ' + error.message);
      } else {
        alert('Workout logged successfully!');
        
        // Re-fetch workout logs
        const { data: newData, error: fetchError } = await supabase
          .from('workout_logs')
          .select(`id, log_date, num_sets, reps_per_set, weight_kg, exercises ( name )`)
          .eq('user_id', user.id)
          .order('log_date', { ascending: false });
          
        if (fetchError) {
          console.error("Error re-fetching logs", fetchError.message);
        } else if (newData) {
          const formattedData = newData.map(log => ({
            id: log.id,
            date: log.log_date,
            routineName: 'Custom',
            exerciseName: (log.exercises as any)?.name || 'Unknown Exercise',
            sets: log.num_sets,
            reps: log.reps_per_set,
            weight: log.weight_kg || 0,
          }));
          setWorkoutHistory(formattedData);
        }
        
        // Reset form fields
        setSelectedExerciseId('');
        setSets('');
        setReps('');
        setWeight('');
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('An unexpected error occurred.');
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-500">Loading workout data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-500">Please log in to track your workouts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Workout Tracker</h2>

          {/* Log a New Workout Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Log a New Workout</h3>
            <form onSubmit={handleLogWorkout} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="routine-type" className="block text-sm font-medium text-gray-700">
                    Workout Routine (Optional)
                  </label>
                  <select
                    id="routine-type"
                    value={selectedRoutineId}
                    onChange={(e) => setSelectedRoutineId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a Routine (or log individual exercise)</option>
                    {routines.map((routine) => (
                      <option key={routine.id} value={routine.id}>
                        {routine.name} ({routine.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="exercise" className="block text-sm font-medium text-gray-700">
                    Exercise
                  </label>
                  <select
                    id="exercise"
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Exercise</option>
                    {availableExercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sets" className="block text-sm font-medium text-gray-700">Sets</label>
                  <input
                    type="number"
                    id="sets"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    min="1"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="reps" className="block text-sm font-medium text-gray-700">Reps</label>
                  <input
                    type="number"
                    id="reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    min="1"
                    required
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
                    min="0"
                    step="0.1"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workout-date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="workout-date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Log Exercise
                </button>
              </div>
            </form>
          </div>

          {/* Workout History Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Workout History</h3>
            {workoutHistory.length === 0 ? (
              <p className="text-gray-500">No workouts logged yet. Use the form above to add your first one!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workoutHistory.map((workout) => (
                      <tr key={workout.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(workout.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.exerciseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.sets}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.reps}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workout.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 