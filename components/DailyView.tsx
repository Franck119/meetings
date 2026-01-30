import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Users, Plus, MapPin, Clock } from 'lucide-react';
import { Meeting, Payment } from '../types';

interface DailyViewProps {
  meetings: Meeting[];
  payments: Payment[];
  onAddPayment: () => void;
}

// Generate 20 sample entries for testing
const generateSampleData = () => {
  const today = new Date();
  const sampleMeetings: Meeting[] = [];
  const samplePayments: Payment[] = [];

  // Generate 10 sample meetings
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + (i % 7) - 3); // Spread across a week

    sampleMeetings.push({
      id: `meeting-${i}`,
      title: [
        'Réunion Équipe Marketing',
        'Présentation Client',
        'Revue Projet',
        'Formation Interne',
        'Brainstorming Produit',
        'Comité Direction',
        'Point Hebdomadaire',
        'Démo Technique',
        'Réunion Budget',
        'Planification Sprint'
      ][i],
      date: date.toISOString().split('T')[0],
      time: ['09:00', '10:30', '14:00', '15:30', '11:00', '16:00', '13:00', '09:30', '14:30', '10:00'][i],
      location: [
        'Salle A - Étage 2',
        'Bureau Principal',
        'Salle de Conférence',
        'Espace Formation',
        'Salle Créative',
        'Bureau Direction',
        'Salle Réunion B',
        'Lab Technique',
        'Salle Conseil',
        'Open Space'
      ][i],
      participants: [
        ['Marie Dubois', 'Jean Martin'],
        ['Sophie Laurent', 'Pierre Durand', 'Luc Bernard'],
        ['Emma Petit', 'Thomas Roux'],
        ['Julie Moreau', 'Antoine Simon', 'Claire Lefebvre'],
        ['Nicolas Blanc', 'Isabelle Garnier'],
        ['François Rousseau', 'Camille Bonnet'],
        ['Alexandre Girard', 'Nathalie Lambert'],
        ['Olivier Fontaine', 'Céline Chevalier', 'Marc Dupont'],
        ['Sylvie Fournier', 'Laurent Mercier'],
        ['Valérie Leroy', 'Julien Barbier', 'Sandrine Renard']
      ][i],
      frequency: ['daily', 'weekly', 'monthly', 'weekly', 'monthly', 'quarterly', 'weekly', 'monthly', 'quarterly', 'weekly'][i] as any,
    });
  }

  // Generate 10 sample payments
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + (i % 7) - 3);

    samplePayments.push({
      id: `payment-${i}`,
      clientName: [
        'Entreprise TechCorp',
        'Solutions Digitales SA',
        'Innovate Group',
        'Global Services Ltd',
        'StartUp Dynamics',
        'Consulting Pro',
        'Digital Agency',
        'Business Partners',
        'Tech Solutions',
        'Creative Studio'
      ][i],
      amount: [5000, 12500, 8000, 15000, 3500, 9500, 6000, 11000, 7500, 4500][i],
      dueDate: date.toISOString().split('T')[0],
      status: ['paid', 'pending', 'paid', 'overdue', 'paid', 'pending', 'paid', 'pending', 'paid', 'overdue'][i] as any,
      description: [
        'Développement site web',
        'Consultation stratégique',
        'Design interface utilisateur',
        'Maintenance système',
        'Formation équipe',
        'Audit sécurité',
        'Campagne marketing',
        'Support technique',
        'Intégration API',
        'Refonte graphique'
      ][i],
    });
  }

  return { sampleMeetings, samplePayments };
};

export default function DailyView({ meetings, payments, onAddPayment }: DailyViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Merge real data with sample data for testing
  const { sampleMeetings, samplePayments } = generateSampleData();
  const allMeetings = [...meetings, ...sampleMeetings];
  const allPayments = [...payments, ...samplePayments];

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
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

  // Filter data for selected date
  const dailyMeetings = allMeetings.filter(
    (meeting) => meeting.date === formatDate(selectedDate)
  );

  const dailyPayments = allPayments.filter(
    (payment) => payment.dueDate === formatDate(selectedDate)
  );

  // Calculate daily summary
  const totalAmount = dailyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = dailyPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = dailyPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const statusColors = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusLabels = {
    paid: 'Payé',
    pending: 'En attente',
    overdue: 'En retard',
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Vue Journalière</h1>

        {/* Date Navigation - Mobile Optimized */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            title="Jour précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span>
                {selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {!isToday && (
              <button
                onClick={goToToday}
                className="mt-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Retour à aujourd\'hui
              </button>
            )}
          </div>

          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            title="Jour suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Daily Summary - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total</p>
          </div>
          <p className="text-base sm:text-xl font-bold text-gray-900">
            {totalAmount.toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Payé</p>
          </div>
          <p className="text-base sm:text-xl font-bold text-green-600">
            {paidAmount.toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Attente</p>
          </div>
          <p className="text-base sm:text-xl font-bold text-yellow-600">
            {pendingAmount.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Meetings Section - Mobile Optimized */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Réunions ({dailyMeetings.length})
          </h2>
        </div>

        {dailyMeetings.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {dailyMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="border border-gray-200 rounded-lg p-2.5 sm:p-3 hover:border-blue-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  {meeting.title}
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">
                      {meeting.participants.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
            Aucune réunion prévue ce jour
          </p>
        )}
      </div>

      {/* Payments Section - Mobile Optimized */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Paiements ({dailyPayments.length})
          </h2>
          <button
            onClick={onAddPayment}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {dailyPayments.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {dailyPayments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-lg p-2.5 sm:p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {payment.clientName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {payment.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border flex-shrink-0 ${
                      statusColors[payment.status]
                    }`}
                  >
                    {statusLabels[payment.status]}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {payment.amount.toLocaleString('fr-FR')} €
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
            Aucun paiement prévu ce jour
          </p>
        )}
      </div>
    </div>
  );
}
