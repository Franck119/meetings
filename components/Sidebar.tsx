
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, user, onLogout }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen w-64 sm:w-72 bg-[#312e81] text-white z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/5">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase">NexCRM</h1>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-indigo-300 font-black opacity-80">Manager Interne</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden ml-auto p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 sm:px-4 mt-2 sm:mt-6 space-y-1 sm:space-y-2 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-indigo-200/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
              </span>
              <span className="font-bold text-xs sm:text-[14px] uppercase tracking-wider">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 sm:p-6 border-t border-white/5 bg-indigo-950/30">
          <div 
            onClick={onLogout}
            className="bg-white/5 p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 hover:bg-rose-500/20 transition-all duration-300 cursor-pointer group border border-white/5"
          >
            <div className="relative">
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-indigo-400/30 group-hover:border-rose-400 transition-all" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#312e81] rounded-full"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs sm:text-sm font-black text-white truncate uppercase tracking-tighter">{user.name}</p>
              <p className="text-[8px] sm:text-[10px] font-bold text-indigo-300 opacity-60 uppercase tracking-[0.1em] group-hover:text-rose-400 transition-colors">Déconnexion</p>
            </div>
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-rose-400 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
