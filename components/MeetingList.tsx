import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Meeting, MeetingFrequency } from '../types';

interface MeetingListProps {
  meetings: Meeting[];
  onAddMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
}

const frequencyColors: Record<MeetingFrequency, string> = {
  daily: 'bg-blue-100 text-blue-800 border-blue-200',
  weekly: 'bg-green-100 text-green-800 border-green-200',
  monthly: 'bg-purple-100 text-purple-800 border-purple-200',
  quarterly: 'bg-orange-100 text-orange-800 border-orange-200',
  yearly: 'bg-red-100 text-red-800 border-red-200',
};

const frequencyLabels: Record<MeetingFrequency, string> = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  yearly: 'Annuel',
};

export default function MeetingList({
  meetings,
  onAddMeeting,
  onEditMeeting,
  onDeleteMeeting,
}: MeetingListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Réunions</h1>
        <button
          onClick={onAddMeeting}
          className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Nouvelle Réunion</span>
        </button>
      </div>

      {/* Search Bar - Mobile Optimized */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Rechercher une réunion..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Meetings Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-3 sm:p-4"
          >
            {/* Meeting Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                  {meeting.title}
                </h3>
                <span
                  className={`inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${
                    frequencyColors[meeting.frequency]
                  }`}
                >
                  {frequencyLabels[meeting.frequency]}
                </span>
              </div>

              {/* Action Buttons - Smaller on mobile */}
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => onEditMeeting(meeting)}
                  className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMeeting(meeting.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meeting Details - Compact on mobile */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {new Date(meeting.date).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{meeting.time}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">{meeting.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {meeting.participants.length} participant{meeting.participants.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Participants - Mobile Optimized */}
            {meeting.participants.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {meeting.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMeetings.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-500">
            {searchTerm ? 'Aucune réunion trouvée' : 'Aucune réunion planifiée'}
          </p>
        </div>
      )}
    </div>
  );
}
