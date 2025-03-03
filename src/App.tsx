import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ReminderForm from './components/ReminderForm';
import EditReminderForm from './components/EditReminderForm';
import ReminderItem from './components/ReminderItem';
import EmptyState from './components/EmptyState';
import ContactForm from './components/ContactForm';
import SettingsPanel from './components/SettingsPanel';

// Utils
import { Reminder } from './types';
import { getReminders, markReminderAsCompleted, deleteReminder } from './utils/storage';
import { requestNotificationPermission, scheduleNotification } from './utils/notifications';

function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [filter, setFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);

  // Load reminders from localStorage
  useEffect(() => {
    const loadedReminders = getReminders();
    setReminders(loadedReminders);
    
    // Request notification permission
    requestNotificationPermission();
    
    // Schedule notifications for all upcoming reminders
    loadedReminders.forEach(reminder => {
      if (!reminder.completed && !reminder.notified) {
        scheduleNotification(reminder.title, reminder.description, reminder.datetime);
      }
    });
    
    // Set up interval to check for due reminders
    const intervalId = setInterval(() => {
      const now = new Date();
      loadedReminders.forEach(reminder => {
        const reminderTime = new Date(reminder.datetime);
        if (!reminder.completed && !reminder.notified && reminderTime <= now) {
          toast.success(`Reminder: ${reminder.title}`, {
            duration: 5000,
          });
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter reminders based on selected filter
  const filteredReminders = reminders.filter(reminder => {
    const now = new Date();
    const reminderDate = new Date(reminder.datetime);
    
    switch (filter) {
      case 'upcoming':
        return !reminder.completed && reminderDate >= now;
      case 'completed':
        return reminder.completed;
      case 'all':
      default:
        return true;
    }
  });

  // Sort reminders by date (upcoming first)
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  const handleAddReminder = (newReminder: Reminder) => {
    setReminders(prev => [...prev, newReminder]);
    toast.success('Reminder added successfully!');
  };

  const handleCompleteReminder = (id: string) => {
    markReminderAsCompleted(id);
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
    toast.success('Reminder completed!');
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted!');
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
  };

  const handleUpdateReminder = (updatedReminder: Reminder) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === updatedReminder.id ? updatedReminder : reminder
      )
    );
    setEditingReminder(null);
    toast.success('Reminder updated!');
  };

  // Group reminders by date
  const remindersByDate: Record<string, Reminder[]> = {};
  sortedReminders.forEach(reminder => {
    const dateKey = format(new Date(reminder.datetime), 'yyyy-MM-dd');
    if (!remindersByDate[dateKey]) {
      remindersByDate[dateKey] = [];
    }
    remindersByDate[dateKey].push(reminder);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      
      <Header 
        onOpenContact={() => setShowContactForm(true)} 
        onToggleMenu={() => setMenuOpen(!menuOpen)}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={menuOpen}
          activeFilter={filter}
          onChangeFilter={setFilter}
          onClose={() => setMenuOpen(false)}
        />
        
        <main className="flex-1 p-4 md:ml-64">
          <div className="container mx-auto max-w-2xl">
            {filter === 'settings' ? (
              <SettingsPanel />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {filter === 'all' && 'All Reminders'}
                    {filter === 'upcoming' && 'Upcoming Reminders'}
                    {filter === 'completed' && 'Completed Reminders'}
                  </h2>
                  
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <PlusCircle size={18} className="mr-1" />
                    <span className="hidden sm:inline">Add Reminder</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
                
                {sortedReminders.length === 0 ? (
                  <EmptyState onAddNew={() => setShowAddForm(true)} />
                ) : (
                  <div>
                    {Object.keys(remindersByDate).map(dateKey => {
                      const dateLabel = format(new Date(dateKey), 'EEEE, MMMM d, yyyy');
                      const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;
                      const isTomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd') === dateKey;
                      
                      let displayDate = dateLabel;
                      if (isToday) displayDate = `Today - ${dateLabel}`;
                      if (isTomorrow) displayDate = `Tomorrow - ${dateLabel}`;
                      
                      return (
                        <div key={dateKey} className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 mb-3">
                            {displayDate}
                          </h3>
                          
                          {remindersByDate[dateKey ].map(reminder => (
                            <ReminderItem
                              key={reminder.id}
                              reminder={reminder}
                              onComplete={handleCompleteReminder}
                              onDelete={handleDeleteReminder}
                              onEdit={handleEditReminder}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      
      {showAddForm && (
        <ReminderForm 
          onClose={() => setShowAddForm(false)} 
          onAdd={handleAddReminder}
        />
      )}
      
      {editingReminder && (
        <EditReminderForm
          reminder={editingReminder}
          onClose={() => setEditingReminder(null)}
          onUpdate={handleUpdateReminder}
        />
      )}
      
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
}

export default App;