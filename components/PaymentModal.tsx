
import React, { useState } from 'react';
import { X, CreditCard, User, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Meeting, PaymentStatus } from '../types';

interface PaymentModalProps {
  meetings: Meeting[];
  onClose: () => void;
  onAdd: (payment: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ meetings, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    meetingId: meetings[0]?.id || '',
    payerName: '',
    amount: meetings[0]?.contributionAmount.toString() || '',
    method: 'BANK_TRANSFER' as const,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payerName || !formData.amount) return;

    onAdd({
      id: `p-${Date.now()}`,
      ...formData,
      amount: parseInt(formData.amount),
      status: PaymentStatus.PAID,
    });
    onClose();
  };

  const handleMeetingChange = (id: string) => {
    const meeting = meetings.find(m => m.id === id);
    setFormData({
      ...formData,
      meetingId: id,
      amount: meeting ? meeting.contributionAmount.toString() : formData.amount
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-8">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Ajouter une Contribution</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Sélectionner la Réunion</label>
            <select 
              value={formData.meetingId}
              onChange={(e) => handleMeetingChange(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200 font-bold"
            >
              {meetings.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.contributionAmount.toLocaleString()} FCFA)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nom du contributeur</label>
              <input 
                required
                type="text"
                placeholder="Ex: Jean Dupont"
                value={formData.payerName}
                onChange={(e) => setFormData({...formData, payerName: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Montant (FCFA)</label>
              <input 
                required
                type="number"
                placeholder="5000"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200 font-black text-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Méthode</label>
              <select 
                value={formData.method}
                onChange={(e) => setFormData({...formData, method: e.target.value as any})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="BANK_TRANSFER">Virement Bancaire</option>
                <option value="CASH">Espèces</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CHECK">Chèque</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Date du paiement</label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4f46e5] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-[#4338ca] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            Confirmer le Paiement
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
