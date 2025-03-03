import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, Trash2, Edit } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderItemProps {
  reminder: Reminder;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ 
  reminder, 
  onComplete, 
  onDelete,
  onEdit
}) => {
  const isOverdue = new Date(reminder.datetime) < new Date() && !reminder.completed;
  const formattedDate = format(new Date(reminder.datetime), 'MMM dd, yyyy');
  const formattedTime = format(new Date(reminder.datetime), 'h:mm a');

  return (
    <div className={`border rounded-lg p-4 mb-3 shadow-sm ${
      reminder.completed 
        ? 'bg-gray-50 border-gray-200' 
        : isOverdue 
          ? 'bg-red-50 border-red-200' 
          : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-medium ${
            reminder.completed ? 'text-gray-500 line-through' : 'text-gray-800'
          }`}>
            {reminder.title}
          </h3>
          
          {reminder.description && (
            <p className={`mt-1 text-sm ${
              reminder.completed ? 'text-gray-400 line-through' : 'text-gray-600'
            }`}>
              {reminder.description}
            </p>
          )}
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>{formattedDate} at {formattedTime}</span>
            {isOverdue && (
              <span className="ml-2 text-red-600 font-medium">Overdue</span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!reminder.completed && (
            <button 
              onClick={() => onComplete(reminder.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
              title="Mark as completed"
            >
              <CheckCircle size={18} />
            </button>
          )}
          
          <button 
            onClick={() => onEdit(reminder)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit reminder"
          >
            <Edit size={18} />
          </button>
          
          <button 
            onClick={() => onDelete(reminder.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete reminder"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderItem;