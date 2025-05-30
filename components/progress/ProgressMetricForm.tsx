'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressMetricFormProps {
  onMetricAdded: () => void;
}

export default function ProgressMetricForm({ onMetricAdded }: ProgressMetricFormProps) {
  const { user } = useAuth();
  const [metricType, setMetricType] = useState<string>('weight');
  const [value, setValue] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !value) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('progress_metrics').insert({
        user_id: user.id,
        metric_type: metricType,
        metric_value: parseFloat(value),
        log_date: date,
      });

      if (error) {
        alert('Error adding metric: ' + error.message);
      } else {
        alert('Metric added successfully!');
        setValue('');
        onMetricAdded(); // Refresh the parent component
      }
    } catch (error) {
      console.error('Error adding metric:', error);
      alert('Error adding metric');
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Progress Metric</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="metricType" className="block text-sm font-medium text-gray-700">
              Metric Type
            </label>
            <select
              id="metricType"
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="weight">Weight (kg)</option>
              <option value="body_fat">Body Fat (%)</option>
              <option value="muscle_mass">Muscle Mass (kg)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              type="number"
              id="value"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Metric'}
          </button>
        </div>
      </form>
    </div>
  );
} 