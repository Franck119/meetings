
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
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Réunions & Lieux</h2>
          <p className="text-slate-500 font-medium">Gestion par zone géographique</p>
        </div>
        <button 
          onClick={onAddMeeting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Réunion
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Recherche interne..." 
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold outline-none dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  cityFilter === city 
                  ? 'bg-indigo-600 text-white shadow-lg' 
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Réunion & Ville</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fréquence</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Montant</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Participants</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prochaine Date</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em]">Aucune réunion trouvée</p>
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${meeting.color} rounded-2xl flex items-center justify-center text-white shadow-sm transform group-hover:scale-110 transition-transform`}>
                          <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-slate-200 text-lg uppercase tracking-tight">{meeting.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-xs text-slate-500 font-black uppercase tracking-widest">{meeting.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700">
                        {meeting.frequency}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 dark:text-slate-200 text-lg">{meeting.contributionAmount.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">FCFA</span></p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-3">
                        {meeting.attendees.map((a, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-300 shadow-md">
                            {a[0]}
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                          +
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-black uppercase tracking-tighter">{meeting.nextDate}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onEditMeeting(meeting)}
                        className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200 group-hover:text-indigo-600"
                        title="Modifier Réunion"
                      >
                        <Edit3 className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
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
