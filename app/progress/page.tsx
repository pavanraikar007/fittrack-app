'use client';

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import ProgressMetricForm from '@/components/progress/ProgressMetricForm';

interface ProgressMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  log_date: string;
}

interface WorkoutLog {
  id: string;
  log_date: string;
  exercises: { name: string; category: string } | null;
}

// Helper function to process workout types for Pie Chart
const processWorkoutTypes = (workouts: WorkoutLog[]) => {
  const typeCounts: { [key: string]: number } = {};
  workouts.forEach(workout => {
    const type = workout.exercises?.category || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
};

const PIE_CHART_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1'];

export default function ProgressDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchProgressData = async () => {
    if (user) {
      setLoadingData(true);
      try {
        // Fetch progress metrics - using actual column names from user's schema
        let metricsData = [];
        try {
          const { data, error } = await supabase
            .from('progress_metrics')
            .select('*')
            .eq('user_id', user.id)
            .order('log_date', { ascending: true });

          if (error) {
            console.error('Error fetching progress metrics:', error.message);
            metricsData = [];
          } else {
            metricsData = data || [];
          }
        } catch (tableError) {
          console.error('Progress metrics table error:', tableError);
          metricsData = [];
        }

        setProgressMetrics(metricsData);

        // Fetch workout logs with exercise categories - using actual schema
        const { data: workoutData, error: workoutError } = await supabase
          .from('workout_logs')
          .select(`
            id,
            log_date,
            exercises ( name, category )
          `)
          .eq('user_id', user.id)
          .order('log_date', { ascending: false });

        if (workoutError) {
          console.error('Error fetching workout logs:', workoutError.message);
          setWorkoutLogs([]);
        } else {
          setWorkoutLogs((workoutData || []).map(log => ({
            ...log,
            exercises: Array.isArray(log.exercises) ? log.exercises[0] : log.exercises
          })));
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
      setLoadingData(false);
    } else if (!authLoading) {
      setProgressMetrics([]);
      setWorkoutLogs([]);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isClient) {
      fetchProgressData();
    }
  }, [user, authLoading, isClient]);

  // Process data for charts - using correct property names
  const weightData = progressMetrics
    .filter(metric => metric.metric_type === 'weight')
    .map(item => ({
      date: item.log_date,
      value: item.metric_value,
    }));

  const workoutTypesData = processWorkoutTypes(workoutLogs);

  // Quick Stats calculations - only run on client
  const workoutsThisWeek = isClient ? workoutLogs.filter(w => {
    const workoutDate = new Date(w.log_date);
    const today = new Date();
    const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return workoutDate >= oneWeekAgo && workoutDate <= today;
  }).length : 0;

  const avgWeight = weightData.length > 0
    ? Math.round((weightData.reduce((sum, item) => sum + item.value, 0) / weightData.length) * 10) / 10
    : 0;

  // Dynamic Progress Calculations - updated to work with actual categories
  const calculateProgress = () => {
    if (!isClient) return { strength: 0, cardio: 0, flexibility: 0, overall: 0 };
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentWorkouts = workoutLogs.filter(w => new Date(w.log_date) >= thirtyDaysAgo);
    
    // Calculate workout frequency progress (based on consistency)
    const workoutFrequency = Math.min((recentWorkouts.length / 20) * 100, 100);
    
    // Map actual categories to fitness types
    const strengthCategories = ['Back', 'Back/Legs', 'Chest', 'Arms', 'Shoulders', 'Legs', 'Core'];
    const cardioCategories = ['Cardio', 'Running', 'Cycling', 'Swimming'];
    const flexibilityCategories = ['Flexibility', 'Yoga', 'Stretching'];
    
    // Calculate category-based progress using actual database categories
    const strengthWorkouts = recentWorkouts.filter(w => {
      const category = w.exercises?.category;
      return category && strengthCategories.some(cat => 
        category.toLowerCase().includes(cat.toLowerCase())
      );
    }).length;
    
    const cardioWorkouts = recentWorkouts.filter(w => {
      const category = w.exercises?.category;
      return category && cardioCategories.some(cat => 
        category.toLowerCase().includes(cat.toLowerCase())
      );
    }).length;
    
    const flexibilityWorkouts = recentWorkouts.filter(w => {
      const category = w.exercises?.category;
      return category && flexibilityCategories.some(cat => 
        category.toLowerCase().includes(cat.toLowerCase())
      );
    }).length;
    
    const strengthProgress = Math.min((strengthWorkouts / 10) * 100, 100);
    const cardioProgress = Math.min((cardioWorkouts / 8) * 100, 100);
    const flexibilityProgress = Math.min((flexibilityWorkouts / 5) * 100, 100);
    
    return {
      strength: Math.round(strengthProgress),
      cardio: Math.round(cardioProgress),
      flexibility: Math.round(flexibilityProgress),
      overall: Math.round(workoutFrequency)
    };
  };

  const progressStats = calculateProgress();

  if (authLoading || loadingData) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-500">Loading progress data...</p>
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
            <p className="text-center text-gray-500">Please log in to view your progress dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fitness Dashboard</h2>

          {/* Progress Metric Input Form */}
          <ProgressMetricForm onMetricAdded={fetchProgressData} />

          {/* Weight Chart */}
          <div className="mb-8">
            {/* Weight Over Time Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Over Time</h3>
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })}/>
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#10B981" name="Weight (kg)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No weight data recorded yet
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Workout Breakdown and Recent Progress/Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workout Types Breakdown Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Types Breakdown</h3>
              {workoutTypesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workoutTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {workoutTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No workout data available yet
                </div>
              )}
            </div>

            {/* Recent Progress & Quick Stats */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Strength Progress</span>
                    <span className="text-sm text-gray-500">{progressStats.strength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressStats.strength}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Cardio Endurance</span>
                    <span className="text-sm text-gray-500">{progressStats.cardio}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progressStats.cardio}%` }}></div>
                  </div>
                </div>
                 <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Flexibility</span>
                    <span className="text-sm text-gray-500">{progressStats.flexibility}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${progressStats.flexibility}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-2">Quick Stats</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center sm:text-left">
                    <p className="text-sm text-gray-600">Workouts This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{workoutsThisWeek}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center sm:text-left">
                    <p className="text-sm text-gray-600">Avg. Weight</p>
                    <p className="text-2xl font-bold text-gray-900">{avgWeight.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 