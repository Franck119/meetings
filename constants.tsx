
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  FileText, 
  Users, 
  Settings, 
  MessageSquare,
  Zap
} from 'lucide-react';
import { Meeting, MeetingFrequency, Payment, PaymentStatus, User } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'daily', label: 'Vue Journalière', icon: <Calendar className="w-5 h-5" /> },
  { id: 'meetings', label: 'Réunions', icon: <Calendar className="w-5 h-5" /> },
  { id: 'payments', label: 'Paiements', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'reports', label: 'Rapports', icon: <FileText className="w-5 h-5" /> },
  { id: 'automation', label: 'Automatisation', icon: <Zap className="w-5 h-5" /> },
  { id: 'users', label: 'Équipe', icon: <Users className="w-5 h-5" /> },
  { id: 'chat', label: 'Assistant IA', icon: <MessageSquare className="w-5 h-5" /> },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Boss Admin',
  email: 'boss@nexcrm.ai',
  username: 'boss',
  role: 'SUPER_ADMIN',
  permissions: ['READ', 'WRITE', 'DELETE', 'APPROVE'],
  avatar: 'https://picsum.photos/seed/boss/100/100'
};

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Hebdo Executive',
    category: 'Direction',
    location: 'Douala',
    frequency: MeetingFrequency.WEEKLY,
    contributionAmount: 50000,
    attendees: ['Alex', 'Sarah', 'Mike'],
    nextDate: '2024-06-15',
    color: 'bg-indigo-500',
    specifications: 'Focus sur les KPIs du deuxième trimestre.'
  },
  {
    id: 'm2',
    title: 'Revue Produit',
    category: 'Ingénierie',
    location: 'Yaoundé',
    frequency: MeetingFrequency.MONTHLY,
    contributionAmount: 120000,
    attendees: ['Alex', 'Dave', 'Elena'],
    nextDate: '2024-07-01',
    color: 'bg-emerald-500',
    specifications: 'Démonstration de la nouvelle interface utilisateur NexCRM.'
  },
  {
    id: 'm3',
    title: 'Stratégie Ventes',
    category: 'Business',
    location: 'Bafoussam',
    frequency: MeetingFrequency.BI_WEEKLY,
    contributionAmount: 35000,
    attendees: ['Sarah', 'John'],
    nextDate: '2024-06-18',
    color: 'bg-amber-500',
    specifications: 'Analyse des parts de marché régionales.'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'p1',
    meetingId: 'm1',
    amount: 50000,
    status: PaymentStatus.PAID,
    date: '2024-06-08',
    payerName: 'Sarah Miller',
    method: 'BANK_TRANSFER',
    receiptNumber: 'REC-2024-001'
  },
  {
    id: 'p2',
    meetingId: 'm1',
    amount: 50000,
    status: PaymentStatus.PENDING,
    date: '2024-06-15',
    payerName: 'Boss Admin',
    method: 'MOBILE_MONEY'
  }
];
