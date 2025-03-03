import React from 'react';
import { Calendar, CheckCircle, Clock, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeFilter: string;
  onChangeFilter: (filter: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  activeFilter, 
  onChangeFilter,
  onClose
}) => {
  const menuItems = [
    { id: 'all', label: 'All Reminders', icon: <Calendar size={20} /> },
    { id: 'upcoming', label: 'Upcoming', icon: <Clock size={20} /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out w-64 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">Menu</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul>
            {menuItems.map(item => (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => {
                    onChangeFilter(item.id);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeFilter === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;