
import React, { useState, useEffect } from 'react';
import { X, MapPin, FileText, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { Meeting, MeetingFrequency } from '../types';

interface MeetingModalProps {
  editingMeeting?: Meeting | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const PALETTE = [
  'bg-indigo-500', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-cyan-400',
  'bg-violet-400', 'bg-fuchsia-400', 'bg-sky-400', 'bg-teal-400', 'bg-lime-400',
  'bg-orange-400', 'bg-red-400', 'bg-slate-400', 'bg-pink-400', 'bg-blue-400'
];

const MeetingModal: React.FC<MeetingModalProps> = ({ editingMeeting, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Général',
    location: '',
    frequency: MeetingFrequency.WEEKLY,
    contributionAmount: '',
    nextDate: new Date().toISOString().split('T')[0],
    color: 'bg-indigo-500',
    specifications: ''
  });

  useEffect(() => {
    if (editingMeeting) {
      setFormData({
        title: editingMeeting.title,
        category: editingMeeting.category,
        location: editingMeeting.location,
        frequency: editingMeeting.frequency,
        contributionAmount: editingMeeting.contributionAmount.toString(),
        nextDate: editingMeeting.nextDate,
        color: editingMeeting.color,
        specifications: editingMeeting.specifications || ''
      });
    }
  }, [editingMeeting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      contributionAmount: parseInt(formData.contributionAmount) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-[480px] rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-4 my-auto max-h-[95vh] flex flex-col">
        {/* Compact Header */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {editingMeeting ? 'Modifier la Réunion' : 'Planifier une Réunion'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 custom-scrollbar">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Titre de la Réunion</label>
            <input 
              required
              type="text"
              placeholder="Ex: Conseil de Direction"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Catégorie</label>
              <input 
                required
                type="text"
                placeholder="Général"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Lieu (Ville/Zone)</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  placeholder="Ex: Douala"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-11 pr-5 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>

          {/* Frequency & Date */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Fréquence</label>
              <div className="relative">
                <select 
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  <option value={MeetingFrequency.WEEKLY}>Hebdomadaire</option>
                  <option value={MeetingFrequency.BI_WEEKLY}>Bi-Hebdomadaire</option>
                  <option value={MeetingFrequency.MONTHLY}>Mensuel</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Date Prévue</label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  value={formData.nextDate}
                  onChange={(e) => setFormData({...formData, nextDate: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Contribution Amount */}
          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Contribution (FCFA)</label>
            <input 
              required
              type="number"
              placeholder="Ex: 50000"
              value={formData.contributionAmount}
              onChange={(e) => setFormData({...formData, contributionAmount: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Specifications */}
          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Spécifications & Commentaires</label>
            <div className="relative">
              <textarea 
                placeholder="Spécifications particulières, ordres du jour, ou notes de rappel..."
                value={formData.specifications}
                onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                className="w-full pl-11 pr-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs sm:text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[80px] sm:min-h-[100px] resize-none placeholder:text-slate-300"
              />
              <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-3">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Couleur Signature (Palette de 15)</label>
            <div className="grid grid-cols-5 gap-2.5">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({...formData, color: c})}
                  className={`w-full aspect-square rounded-[12px] sm:rounded-[14px] ${c} transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm border-2 ${formData.color === c ? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-transparent'}`}
                >
                  {formData.color === c && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mx-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky-like Footer Button */}
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-[#4f46e5] text-white py-4 sm:py-4.5 rounded-[20px] sm:rounded-[24px] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 sm:w-5 h-5" />
              {editingMeeting ? 'Sauvegarder' : 'Créer la Réunion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;
