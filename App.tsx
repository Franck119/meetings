
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MeetingList from './components/MeetingList';
import AssistantChat from './components/AssistantChat';
import PaymentModal from './components/PaymentModal';
import MeetingModal from './components/MeetingModal';
import DetailsModal from './components/DetailsModal';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import Login from './components/Login';
import { MOCK_MEETINGS, MOCK_PAYMENTS } from './constants';
import { Search, Menu, Sparkles, Moon, Sun, CreditCard, Download, Filter } from 'lucide-react';
import { Meeting, PaymentStatus, User } from './types';

// Default users for login simulation
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Boss Admin', email: 'boss@nexcrm.ai', username: 'boss', password: '123', role: 'SUPER_ADMIN', permissions: ['READ', 'WRITE', 'DELETE', 'APPROVE'], avatar: 'https://picsum.photos/seed/1/100' },
  { id: '2', name: 'Jean Finance', email: 'jean@nexcrm.ai', username: 'jean', password: '123', role: 'FINANCE_MANAGER', permissions: ['READ', 'WRITE', 'APPROVE'], avatar: 'https://picsum.photos/seed/2/100' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<'contributions' | 'pending' | 'meetings' | 'projection' | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  useEffect(() => {
    const savedUser = localStorage.getItem('nex_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    // Artificial delay for realism
    await new Promise(r => setTimeout(r, 800));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('nex_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nex_user');
  };

  const handleAddPayment = (newPayment: any) => {
    setPayments(prev => [...prev, newPayment]);
  };

  const handleAddMeeting = (newMeeting: any) => {
    setMeetings(prev => [...prev, newMeeting]);
  };

  const handleUpdateMeeting = (updatedMeeting: any) => {
    setMeetings(prev => prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const meet = meetings.find(m => m.id === p.meetingId);
      return (
        p.payerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (meet?.title || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
        (meet?.location || '').toLowerCase().includes(globalSearch.toLowerCase())
      );
    });
  }, [payments, meetings, globalSearch]);

  const downloadAllTransactionsCSV = () => {
    const headers = ['ID', 'Contributeur', 'Montant', 'Statut', 'Date', 'Méthode'];
    const rows = payments.map(p => [p.id, p.payerName, p.amount, p.status, p.date, p.method]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NexCRM_Global_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
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
      case 'meetings':
        return <MeetingList 
          meetings={meetings} 
          onAddMeeting={() => setShowMeetingModal(true)} 
          onEditMeeting={(m) => setEditingMeeting(m)}
          searchTerm={globalSearch} 
        />;
      case 'chat':
        return <AssistantChat meetings={meetings} payments={payments} />;
      case 'users':
        return <UserManagement users={users} setUsers={setUsers} />;
      case 'reports':
        return <Reports payments={payments} meetings={meetings} />;
      case 'payments':
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Registre Global</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Audit financier complet (FCFA)</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={downloadAllTransactionsCSV}
                  className="flex-1 md:flex-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  Exporter Rapport
                </button>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-1 md:flex-none bg-[#4f46e5] hover:bg-[#4338ca] text-white px-10 py-4 rounded-[24px] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 text-xs uppercase tracking-widest"
                >
                  Ajouter Flux
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50 dark:border-slate-800">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Résultats filtrés: {filteredPayments.length}</h3>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl">
                   <Filter className="w-3 h-3" />
                   Options Avancées
                 </button>
              </div>
              <div className="space-y-5">
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[40px]">
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em]">Aucun flux trouvé pour "{globalSearch}"</p>
                  </div>
                ) : (
                  filteredPayments.slice().reverse().map(p => {
                    const meet = meetings.find(m => m.id === p.meetingId);
                    return (
                      <div key={p.id} className="group flex flex-col sm:flex-row items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                        <div className="flex items-center gap-8 w-full">
                          <div className="w-16 h-16 rounded-[24px] bg-white dark:bg-slate-900 flex items-center justify-center shadow-md">
                            <CreditCard className="w-8 h-8 text-indigo-500" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-white text-xl uppercase tracking-tighter">{p.payerName}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                               <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase tracking-widest">{meet?.title}</span>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.date} • {p.method}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 mt-6 sm:mt-0 w-full sm:w-auto justify-end">
                           <div className="text-right">
                             <p className="font-black text-3xl text-indigo-600 dark:text-indigo-400 tracking-tighter">{p.amount.toLocaleString()}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">FCFA TOTAL</p>
                           </div>
                           <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-400 hover:text-indigo-600 hover:rotate-6 transition-all border border-slate-100 dark:border-slate-800">
                             <Download className="w-6 h-6" />
                           </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-24 text-center bg-white dark:bg-slate-900 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Section en cours</h2>
            <p className="text-slate-500 mt-6 font-black uppercase text-xs tracking-widest max-w-md mx-auto opacity-60">Le module <span className="text-indigo-600">"{activeTab}"</span> est en cours d'optimisation par l'équipe Nex IA.</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-600`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
        <header className="h-28 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 sm:px-16 sticky top-0 z-40">
          <div className="flex items-center gap-10 flex-1">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-4 bg-slate-100 dark:bg-slate-900 rounded-[22px] text-slate-600 dark:text-slate-300 shadow-sm"><Menu className="w-8 h-8" /></button>
             <div className="relative w-full max-w-xl hidden sm:block group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Recherche Intelligente Boss (Ville, Nom, Réunion)..." 
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500/30 rounded-[28px] text-base font-black outline-none transition-all dark:text-white shadow-inner" 
                />
             </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-2 rounded-[24px] gap-1 shadow-inner border border-slate-200/30 dark:border-slate-800">
              <button onClick={() => setDarkMode(false)} className={`flex items-center gap-3 px-8 py-3.5 text-xs font-black uppercase tracking-[0.1em] rounded-[18px] transition-all ${!darkMode ? 'bg-white text-indigo-600 shadow-xl transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}><Sun className="w-5 h-5" />Clair</button>
              <button onClick={() => setDarkMode(true)} className={`flex items-center gap-3 px-8 py-3.5 text-xs font-black uppercase tracking-[0.1em] rounded-[18px] transition-all ${darkMode ? 'bg-indigo-600 text-white shadow-xl transform scale-105' : 'text-slate-400 hover:text-slate-500'}`}><Moon className="w-5 h-5" />Sombre</button>
            </div>
            <div className="hidden sm:block">
              <div className="w-16 h-16 rounded-[24px] border-4 border-indigo-100 dark:border-indigo-900 p-1.5 bg-white dark:bg-slate-800 shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer">
                <img src={currentUser.avatar} alt="Boss" className="w-full h-full rounded-[18px] object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 sm:p-16 max-w-[1800px] w-full mx-auto flex-1">
          {renderContent()}
        </div>
      </main>

      <button 
        className="fixed bottom-12 right-12 w-24 h-24 bg-gradient-to-tr from-[#4f46e5] to-[#818cf8] text-white rounded-[40px] shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] flex items-center justify-center hover:scale-110 hover:-rotate-12 active:scale-90 transition-all z-50 group border-[8px] border-white dark:border-slate-900" 
        onClick={() => setActiveTab('chat')}
      >
        <SparklesIcon className="w-12 h-12 group-hover:animate-pulse" />
      </button>

      {showPaymentModal && <PaymentModal meetings={meetings} onClose={() => setShowPaymentModal(false)} onAdd={handleAddPayment} />}
      {(showMeetingModal || editingMeeting) && (
        <MeetingModal 
          editingMeeting={editingMeeting} 
          onClose={() => { setShowMeetingModal(false); setEditingMeeting(null); }} 
          onAdd={handleAddMeeting} 
          onUpdate={handleUpdateMeeting}
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

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="19" cy="19" r="2" />
  </svg>
);

export default App;
