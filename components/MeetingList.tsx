
import React, { useState, useMemo } from 'react';
import { Meeting } from '../types';
import { MoreHorizontal, Plus, Search, Calendar, MapPin, Edit3 } from 'lucide-react';

interface MeetingListProps {
  meetings: Meeting[];
  onAddMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  searchTerm?: string;
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, onAddMeeting, onEditMeeting, searchTerm = '' }) => {
  const [localFilter, setLocalFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('TOUTES');

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchesSearch = 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = cityFilter === 'TOUTES' || m.location.toUpperCase() === cityFilter.toUpperCase();
      const matchesLocal = m.title.toLowerCase().includes(localFilter.toLowerCase());

      return matchesSearch && matchesCity && matchesLocal;
    });
  }, [meetings, searchTerm, cityFilter, localFilter]);

  const cities = useMemo(() => {
    const set = new Set(meetings.map(m => m.location.toUpperCase()));
    return ['TOUTES', ...Array.from(set)];
  }, [meetings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Réunions</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Gestion Géo-Localisée</p>
        </div>
        <button 
          onClick={onAddMeeting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black shadow-lg transition-all active:scale-95 text-xs uppercase"
        >
          <Plus className="w-4 h-4" />
          Planifier
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] sm:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filtre local..." 
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  cityFilter === city 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Réunion</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Lieu</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Vide</td>
                </tr>
              ) : (
                filteredMeetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${meeting.color} rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-tight truncate max-w-[120px]">{meeting.title}</p>
                          <div className="flex sm:hidden items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{meeting.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{meeting.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-800 dark:text-slate-200 text-sm">{meeting.contributionAmount.toLocaleString()} <span className="text-[8px] text-slate-400 uppercase">FCFA</span></p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase">{meeting.nextDate}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onEditMeeting(meeting)}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200"
                      >
                        <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeetingList;
