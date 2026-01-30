
import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { Meeting, PaymentStatus } from '../types';

interface PaymentModalProps {
  meetings: Meeting[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ meetings, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    meetingId: meetings[0]?.id || '',
    payerName: '',
    amount: meetings[0]?.contributionAmount?.toString() || '',
    method: 'BANK_TRANSFER' as const,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payerName || !formData.amount || !formData.meetingId) return;
    
    onSave({
      ...formData,
      amount: parseInt(formData.amount),
      status: PaymentStatus.PAID
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-[420px] rounded-[32px] sm:rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-4 overflow-hidden">
        {/* Compact Header */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ajouter une Contribution</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 sm:space-y-5">
          {/* Meeting Selection */}
          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Sélectionner la Réunion</label>
            <div className="relative">
              <select 
                value={formData.meetingId}
                onChange={(e) => {
                  const m = meetings.find(meet => meet.id === e.target.value);
                  setFormData({
                    ...formData, 
                    meetingId: e.target.value,
                    amount: m?.contributionAmount.toString() || ''
                  });
                }}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                {meetings.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.contributionAmount.toLocaleString()} FCFA)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Row: Contributor & Amount */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Nom du Contributeur</label>
              <input 
                required
                type="text"
                placeholder="Ex: Jean Dupont"
                value={formData.payerName}
                onChange={(e) => setFormData({...formData, payerName: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Montant (FCFA)</label>
              <input 
                required
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Row: Method & Date */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Méthode</label>
              <div className="relative">
                <select 
                  value={formData.method}
                  onChange={(e) => setFormData({...formData, method: e.target.value as any})}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  <option value="BANK_TRANSFER">Virement Bancaire</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CASH">Espèces</option>
                  <option value="CHECK">Chèque</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Date du Paiement</label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4f46e5] text-white py-4 sm:py-4.5 rounded-[20px] sm:rounded-[24px] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-[0.98] mt-2"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 h-5" />
            Confirmer le Paiement
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
