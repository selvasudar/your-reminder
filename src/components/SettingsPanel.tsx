import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Moon, Sun } from 'lucide-react';
import { requestNotificationPermission } from '../utils/notifications';

const SettingsPanel: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check notification permission on component mount
    const checkPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      setNotificationsEnabled(hasPermission);
    };
    
    checkPermission();
    
    // Load saved preferences
    const savedSound = localStorage.getItem('sound-enabled');
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
    
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const hasPermission = await requestNotificationPermission();
      setNotificationsEnabled(hasPermission);
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('sound-enabled', String(newValue));
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('dark-mode', String(newValue));
    
    // In a real app, you would apply dark mode to the document here
    // document.documentElement.classList.toggle('dark', newValue);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-md mr-3">
              <Bell size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500">Enable reminder notifications</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={notificationsEnabled}
              onChange={toggleNotifications}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-md mr-3">
              <Volume2 size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Sound</h3>
              <p className="text-sm text-gray-500">Play sound with notifications</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={soundEnabled}
              onChange={toggleSound}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-md mr-3">
              {darkMode ? (
                <Moon size={20} className="text-purple-600" />
              ) : (
                <Sun size={20} className="text-purple-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Dark Mode</h3>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t">
        <p className="text-sm text-gray-500 text-center">
          Your Reminder v1.0.0
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;