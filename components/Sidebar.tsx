import React from 'react';
import { NavItem } from '../types';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  currentUser: string;
}

export default function Sidebar({
  navItems,
  activeTab,
  onTabChange,
  onLogout,
  currentUser,
}: SidebarProps) {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-full sm:w-64 flex flex-col shadow-xl">
      {/* Logo - Mobile Optimized */}
      <div className="p-3 sm:p-6 border-b border-blue-700">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          NexCRM
        </h1>
        <p className="text-xs sm:text-sm text-blue-200 mt-1">Finance & Meetings</p>
      </div>

      {/* Navigation - Mobile Optimized */}
      <nav className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-lg scale-105'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon className={`flex-shrink-0 ${
                    item.id === 'assistant' 
                      ? 'w-4 h-4 sm:w-5 sm:h-5'  // Smaller icon for AI Assistant
                      : 'w-5 h-5 sm:w-6 sm:h-6'
                  }`} />
                  <span className="text-sm sm:text-base font-medium truncate">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout - Mobile Optimized */}
      <div className="p-3 sm:p-4 border-t border-blue-700">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm sm:text-base font-semibold">
              {currentUser.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium truncate">{currentUser}</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Administrateur</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm sm:text-base active:scale-95"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
