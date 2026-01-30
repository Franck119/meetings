
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CreditCard, Plus, ArrowRight } from 'lucide-react';
import { Meeting, Payment, PaymentStatus } from '../types';

interface DailyViewProps {
  payments: Payment[];
  meetings: Meeting[];
  onAddPayment: () => void;
}

const DailyView: React.FC<DailyViewProps> = ({ payments, meetings, onAddPayment }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const navigateDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dailyData = useMemo(() => {
    const filtered = payments.filter(p => p.date === selectedDate);
    const total = filtered.reduce((s, p) => s + p.amount, 0);
    const paid = filtered.filter(p => p.status === PaymentStatus.PAID).reduce((s, p) => s + p.amount, 0);
    const pending = filtered.filter(p => p.status === PaymentStatus.PENDING).reduce((s, p) => s + p.amount, 0);
    
    return { list: filtered, total, paid, pending };
  }, [payments, selectedDate]);

  const formattedDate = new Date(selectedDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Date Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <button onClick={() => navigateDate(-1)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <ChevronLeft className="w-6 h-6 text-slate-400" />
          </button>
          <div className="flex-1 px-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Journal d'Audit</p>
            <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase truncate max-w-[180px]">{formattedDate}</h3>
          </div>
          <button onClick={() => navigateDate(1)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <ChevronRight className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button 
             onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
             className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest"
           >
             Aujourd'hui
           </button>
           <button 
             onClick={onAddPayment}
             className="flex-1 sm:flex-none px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
           >
             <Plus className="w-4 h-4" /> Entrée
           </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl">
           <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Collecté</p>
           <h4 className="text-xl font-black mt-1 truncate">{dailyData.paid.toLocaleString()} FCFA</h4>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
           <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">En Attente</p>
           <h4 className="text-xl font-black mt-1 text-amber-500 truncate">{dailyData.pending.toLocaleString()} FCFA</h4>
        </div>
        <div className="hidden md:block bg-slate-900 p-6 rounded-[32px] text-white">
           <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Volume Jour</p>
           <h4 className="text-xl font-black mt-1 truncate">{dailyData.total.toLocaleString()} FCFA</h4>
        </div>
      </div>

      {/* Daily List */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800">
           <h3 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-widest">Transactions du jour</h3>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {dailyData.list.length === 0 ? (
            <div className="py-20 text-center">
               <CalendarIcon className="w-12 h-12 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune activité enregistrée</p>
            </div>
          ) : (
            dailyData.list.map(p => {
              const m = meetings.find(meet => meet.id === p.meetingId);
              return (
                <div key={p.id} className="p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500">
                       <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 dark:text-white text-xs sm:text-sm uppercase tracking-tight">{p.payerName}</p>
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase mt-0.5">{m?.title} • {m?.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm sm:text-base text-slate-800 dark:text-white">{p.amount.toLocaleString()} FCFA</p>
                    <span className={`text-[7px] sm:text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === PaymentStatus.PAID ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyView;
