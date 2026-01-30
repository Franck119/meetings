
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailyView from './components/DailyView';
import MeetingList from './components/MeetingList';
import AssistantChat from './components/AssistantChat';
import PaymentModal from './components/PaymentModal';
import MeetingModal from './components/MeetingModal';
import DetailsModal from './components/DetailsModal';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import Login from './components/Login';
import { MOCK_USER, MOCK_MEETINGS, MOCK_PAYMENTS } from './constants';
import { Search, Menu, Sparkles, Moon, Sun, CreditCard, X } from 'lucide-react';
import { Meeting, User, Payment, PaymentStatus } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [detailsType, setDetailsType] = useState<'contributions' | 'pending' | 'meetings' | 'projection' | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddPayment = (newPayment: Omit<Payment, 'id' | 'receiptNumber'>) => {
    const payment: Payment = {
      ...newPayment,
      id: `p-${Date.now()}`,
      receiptNumber: `REC-${Math.floor(Math.random() * 1000000)}`
    };
    setPayments([payment, ...payments]);
  };

  const handleSaveMeeting = (meetingData: Omit<Meeting, 'id' | 'attendees'>) => {
    if (editingMeeting) {
      setMeetings(meetings.map(m => m.id === editingMeeting.id ? { ...m, ...meetingData } : m));
    } else {
      const newMeeting: Meeting = {
        ...meetingData,
        id: `m-${Date.now()}`,
        attendees: ['Boss Admin']
      };
      setMeetings([newMeeting, ...meetings]);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const meet = meetings.find(m => m.id === p.meetingId);
      return (
        p.payerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (meet?.title || '').toLowerCase().includes(globalSearch.toLowerCase())
      );
    });
  }, [payments, meetings, globalSearch]);

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          payments={payments} 
          meetings={meetings} 
          onAddPayment={() => setShowPaymentModal(true)} 
          onOpenDetails={(type) => setDetailsType(type)}
        />;
      case 'daily':
        return <DailyView 
          payments={payments} 
          meetings={meetings} 
          onAddPayment={() => setShowPaymentModal(true)} 
        />;
      case 'meetings':
        return <MeetingList 
          meetings={meetings} 
          onAddMeeting={() => setShowMeetingModal(true)} 
          onEditMeeting={(m) => { setEditingMeeting(m); setShowMeetingModal(true); }}
          searchTerm={globalSearch} 
        />;
      case 'chat':
        return <AssistantChat meetings={meetings} payments={payments} />;
      case 'reports':
        return <Reports payments={payments} meetings={meetings} />;
      case 'users':
        return <UserManagement users={[currentUser]} setUsers={() => {}} />;
      case 'payments':
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Registre Local</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Audit Financier Actif (FCFA)</p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest"
              >
                Nouvelle Entrée
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[48px] border border-slate-100 dark:border-slate-800 p-4 sm:p-10 shadow-sm">
              <div className="space-y-3 sm:space-y-5">
                {filteredPayments.map(p => {
                  const meet = meetings.find(m => m.id === p.meetingId);
                  return (
                    <div key={p.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[20px] sm:rounded-[32px] border border-transparent hover:border-indigo-100 transition-all gap-3">
                      <div className="flex items-center gap-4 sm:gap-8">
                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[24px] bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                          <CreditCard className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-white text-base sm:text-xl uppercase tracking-tighter">{p.payerName}</p>
                          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{meet?.title} • {p.date}</p>
                        </div>
                      </div>
                      <p className="font-black text-lg sm:text-3xl text-indigo-600 dark:text-indigo-400 tracking-tighter">{p.amount.toLocaleString()} FCFA</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500`}>
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} setIsOpen={setSidebarOpen}
        user={currentUser} onLogout={handleLogout}
      />
      
      <main className="lg:ml-72 min-h-screen flex flex-col">
        <header className="h-20 sm:h-28 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 sm:px-16 sticky top-0 z-40">
          <div className="flex items-center gap-4 sm:gap-10 flex-1">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-600 dark:text-slate-300 shadow-sm"><Menu className="w-6 h-6" /></button>
             <div className="relative w-full max-w-xl hidden sm:block">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                <input 
                  type="text" 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Rechercher..." 
                  className="w-full pl-16 pr-8 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-[20px] text-sm font-black outline-none transition-all dark:text-white" 
                />
             </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[24px] border-2 sm:border-4 border-indigo-100 p-0.5 bg-white shadow-md overflow-hidden shrink-0">
              <img src={currentUser.avatar} alt="Boss" className="w-full h-full rounded-[10px] sm:rounded-[18px] object-cover" />
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-16 max-w-[1800px] w-full mx-auto flex-1">
          {renderContent()}
        </div>
      </main>

      <button 
        className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 border-4 border-white dark:border-slate-900" 
        onClick={() => setActiveTab('chat')}
      >
        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {showPaymentModal && <PaymentModal meetings={meetings} onClose={() => setShowPaymentModal(false)} onSave={handleAddPayment} />}
      {showMeetingModal && (
        <MeetingModal 
          editingMeeting={editingMeeting} 
          onClose={() => { setShowMeetingModal(false); setEditingMeeting(null); }} 
          onSave={handleSaveMeeting}
        />
      )}
      {detailsType && (
        <DetailsModal 
          type={detailsType} 
          meetings={meetings} 
          payments={payments} 
          onClose={() => setDetailsType(null)} 
        />
      )}
    </div>
  );
};

export default App;
