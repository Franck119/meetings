
import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle2, MapPin, Save, FileText } from 'lucide-react';
import { Meeting, MeetingFrequency } from '../types';

interface MeetingModalProps {
  editingMeeting?: Meeting | null;
  onClose: () => void;
  onAdd: (meeting: any) => void;
  onUpdate: (meeting: any) => void;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ editingMeeting, onClose, onAdd, onUpdate }) => {
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

  const colors = [
    { name: 'Indigo', class: 'bg-indigo-500' },
    { name: 'Émeraude', class: 'bg-emerald-500' },
    { name: 'Ambre', class: 'bg-amber-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Cyan', class: 'bg-cyan-500' },
    { name: 'Violet', class: 'bg-violet-600' },
    { name: 'Fuchsia', class: 'bg-fuchsia-500' },
    { name: 'Sky', class: 'bg-sky-400' },
    { name: 'Teal', class: 'bg-teal-500' },
    { name: 'Lime', class: 'bg-lime-500' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Slate', class: 'bg-slate-500' },
    { name: 'Pink', class: 'bg-pink-400' },
    { name: 'Blue', class: 'bg-blue-600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contributionAmount || !formData.location) return;

    if (editingMeeting) {
      onUpdate({
        ...editingMeeting,
        ...formData,
        contributionAmount: parseInt(formData.contributionAmount)
      });
    } else {
      onAdd({
        id: `m-${Date.now()}`,
        ...formData,
        contributionAmount: parseInt(formData.contributionAmount),
        attendees: ['Boss Admin']
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-8 my-8">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {editingMeeting ? 'Modifier la Réunion' : 'Planifier une Réunion'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Titre de la réunion</label>
            <input 
              required
              type="text"
              placeholder="Ex: Conseil de Direction"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catégorie</label>
              <input 
                type="text"
                placeholder="Ex: Finance"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lieu (Ville/Zone)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="text"
                  placeholder="Ex: Douala"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fréquence</label>
              <select 
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 font-bold transition-all"
              >
                <option value={MeetingFrequency.WEEKLY}>Hebdomadaire</option>
                <option value={MeetingFrequency.BI_WEEKLY}>Bi-hebdomadaire</option>
                <option value={MeetingFrequency.MONTHLY}>Mensuel</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date Prévue</label>
              <input 
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData({...formData, nextDate: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contribution (FCFA)</label>
            <input 
              required
              type="number"
              placeholder="Ex: 50000"
              value={formData.contributionAmount}
              onChange={(e) => setFormData({...formData, contributionAmount: e.target.value})}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 font-black text-indigo-600 dark:text-indigo-400 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Spécifications & Commentaires</label>
            <div className="relative">
               <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
               <textarea 
                placeholder="Spécifications particulières, ordres du jour, ou notes de rappel..."
                value={formData.specifications}
                onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl outline-none text-slate-700 dark:text-slate-200 text-sm transition-all resize-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Couleur Signature (Palette de 15)</label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {colors.map(c => (
                <button
                  key={c.class}
                  type="button"
                  onClick={() => setFormData({...formData, color: c.class})}
                  className={`w-full aspect-square rounded-xl transition-all transform hover:scale-105 active:scale-95 ${c.class} ${formData.color === c.class ? 'ring-4 ring-slate-200 dark:ring-slate-700 ring-offset-2 dark:ring-offset-slate-900 shadow-lg scale-105' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4f46e5] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-[#4338ca] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
          >
            {editingMeeting ? <Save className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            {editingMeeting ? 'Sauvegarder Modifications' : 'Créer la Réunion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;
