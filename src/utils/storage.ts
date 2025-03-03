import { Reminder } from '../types';

const STORAGE_KEY = 'Your-reminders';

export const getReminders = (): Reminder[] => {
  const storedReminders = localStorage.getItem(STORAGE_KEY);
  return storedReminders ? JSON.parse(storedReminders) : [];
};

export const saveReminders = (reminders: Reminder[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
};

export const addReminder = (reminder: Reminder): void => {
  const reminders = getReminders();
  saveReminders([...reminders, reminder]);
};

export const updateReminder = (updatedReminder: Reminder): void => {
  const reminders = getReminders();
  const updatedReminders = reminders.map(reminder => 
    reminder.id === updatedReminder.id ? updatedReminder : reminder
  );
  saveReminders(updatedReminders);
};

export const deleteReminder = (id: string): void => {
  const reminders = getReminders();
  const filteredReminders = reminders.filter(reminder => reminder.id !== id);
  saveReminders(filteredReminders);
};

export const markReminderAsCompleted = (id: string): void => {
  const reminders = getReminders();
  const updatedReminders = reminders.map(reminder => 
    reminder.id === id ? { ...reminder, completed: true } : reminder
  );
  saveReminders(updatedReminders);
};

export const markReminderAsNotified = (id: string): void => {
  const reminders = getReminders();
  const updatedReminders = reminders.map(reminder => 
    reminder.id === id ? { ...reminder, notified: true } : reminder
  );
  saveReminders(updatedReminders);
};