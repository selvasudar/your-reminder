import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save, X } from 'lucide-react';
import { Reminder } from '../types';
import { updateReminder } from '../utils/storage';
import { scheduleNotification } from '../utils/notifications';

interface EditReminderFormProps {
  reminder: Reminder;
  onClose: () => void;
  onUpdate: (reminder: Reminder) => void;
}

const EditReminderForm: React.FC<EditReminderFormProps> = ({ reminder, onClose, onUpdate }) => {
  const [title, setTitle] = useState(reminder.title);
  const [description, setDescription] = useState(reminder.description);
  const [datetime, setDatetime] = useState(
    format(new Date(reminder.datetime), "yyyy-MM-dd'T'HH:mm")
  );

  useEffect(() => {
    setTitle(reminder.title);
    setDescription(reminder.description);
    setDatetime(format(new Date(reminder.datetime), "yyyy-MM-dd'T'HH:mm"));
  }, [reminder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const updatedReminder: Reminder = {
      ...reminder,
      title: title.trim(),
      description: description.trim(),
      datetime,
      notified: false // Reset notification status so it will notify again
    };

    updateReminder(updatedReminder);
    scheduleNotification(updatedReminder.title, updatedReminder.description, updatedReminder.datetime);
    onUpdate(updatedReminder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Reminder</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter reminder title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter reminder details"
              rows={3}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="datetime"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center"
            >
              <Save size={18} className="mr-1" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReminderForm;