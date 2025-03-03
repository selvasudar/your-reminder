import React from 'react';
import { Bell, Phone, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenContact: () => void;
  onToggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenContact, onToggleMenu }) => {
  return (
    <header className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bell size={24} className="mr-2" />
            <h1 className="text-xl font-bold">Your Reminder</h1>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={onOpenContact}
              className="p-2 rounded-full hover:bg-purple-700 mr-1"
              title="Contact Us"
            >
              <Phone size={20} />
            </button>
            
            <button 
              onClick={onToggleMenu}
              className="p-2 rounded-full hover:bg-purple-700 md:hidden"
              title="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;