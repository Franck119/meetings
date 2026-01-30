import React, { useState, useMemo } from 'react';
import { Meeting, Payment, PaymentStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar, CreditCard, Users, MapPin, Clock, Plus } from 'lucide-react';

interface DailyViewProps {
  meetings: Meeting[];
  payments: Payment[];
  onAddPayment: () => void;
}

const DailyView: React.FC<DailyViewProps> = ({ meetings, payments, onAddPayment }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = formatDate(selectedDate) === formatDate(new Date());

  const dailyPayments = useMemo(() => {
    return payments.filter(p => p.date === formatDate(selectedDate));
  }, [payments, selectedDate]);

  const dailyMeetings = useMemo(() => {
    return meetings.filter(m => m.nextDate === formatDate(selectedDate));
  }, [meetings, selectedDate]);

  const totalAmount = dailyPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = dailyPayments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = dailyPayments
    .filter(p => p.status === PaymentStatus.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case PaymentStatus.PENDING:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case PaymentStatus.APPROVED:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case PaymentStatus.CANCELLED:
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-700">
      {/* Date Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex-1 sm:flex-initial text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {formatDisplayDate(selectedDate)}
              </h2>
              {!isToday && (
                <button
                  onClick={goToToday}
                  className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
                >
                  Retour à aujourd'hui
                </button>
              )}
            </div>

            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <button
            onClick={onAddPayment}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Nouveau Paiement
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {totalAmount.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Payé</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {paidAmount.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">En Attente</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingAmount.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meetings Section */}
      {dailyMeetings.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Réunions du Jour ({dailyMeetings.length})
          </h3>
          <div className="space-y-3">
            {dailyMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="p-3 sm:p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${meeting.color}`}></div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                        {meeting.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        {meeting.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        {meeting.attendees.length} participants
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                      Contribution
                    </p>
                    <p className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400">
                      {meeting.contributionAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Paiements du Jour ({dailyPayments.length})
        </h3>

        {dailyPayments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-700 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Aucun paiement pour cette date
            </p>
            <button
              onClick={onAddPayment}
              className="mt-3 sm:mt-4 px-4 py-2 text-sm sm:text-base text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              Ajouter un paiement
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyPayments.map(payment => {
              const meeting = meetings.find(m => m.id === payment.meetingId);
              return (
                <div
                  key={payment.id}
                  className="p-3 sm:p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-1 truncate">
                        {payment.payerName}
                      </h4>
                      {meeting && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 truncate">
                          {meeting.title} • {meeting.location}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {payment.method}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                        {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">FCFA</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyView;
