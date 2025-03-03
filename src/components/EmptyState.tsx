import React from 'react';
import { Calendar, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="bg-purple-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
        <Calendar size={40} className="text-purple-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No reminders yet</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create your first reminder to help keep track of important tasks and appointments.
      </p>
      <button
        onClick={onAddNew}
        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <PlusCircle size={18} className="mr-2" />
        Add New Reminder
      </button>
    </div>
  );
};

export default EmptyState;