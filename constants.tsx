
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  FileText, 
  Users, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { Meeting, MeetingFrequency, Payment, PaymentStatus, User } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'daily', label: 'Vue Journalière', icon: <Clock className="w-5 h-5" /> },
  { id: 'meetings', label: 'Réunions', icon: <Calendar className="w-5 h-5" /> },
  { id: 'payments', label: 'Paiements', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'reports', label: 'Rapports', icon: <FileText className="w-5 h-5" /> },
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
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boss'
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
  },
  {
    id: 'm4',
    title: 'Finance Kribi',
    category: 'Finance',
    location: 'Kribi',
    frequency: MeetingFrequency.MONTHLY,
    contributionAmount: 200000,
    attendees: ['Boss', 'Alex'],
    nextDate: '2024-06-25',
    color: 'bg-rose-500',
    specifications: 'Audit des investissements portuaires.'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-01', payerName: 'Sarah Miller', method: 'BANK_TRANSFER', receiptNumber: 'REC-001' },
  { id: 'p2', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-01', payerName: 'Alex Johnson', method: 'MOBILE_MONEY', receiptNumber: 'REC-002' },
  { id: 'p3', meetingId: 'm2', amount: 120000, status: PaymentStatus.PAID, date: '2024-06-02', payerName: 'Elena Petrova', method: 'CASH', receiptNumber: 'REC-003' },
  { id: 'p4', meetingId: 'm3', amount: 35000, status: PaymentStatus.PAID, date: '2024-06-02', payerName: 'John Doe', method: 'BANK_TRANSFER', receiptNumber: 'REC-004' },
  { id: 'p5', meetingId: 'm1', amount: 50000, status: PaymentStatus.PENDING, date: '2024-06-03', payerName: 'Mike Ross', method: 'MOBILE_MONEY' },
  { id: 'p6', meetingId: 'm4', amount: 200000, status: PaymentStatus.PAID, date: '2024-06-03', payerName: 'Boss Admin', method: 'BANK_TRANSFER', receiptNumber: 'REC-006' },
  { id: 'p7', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-04', payerName: 'Sarah Miller', method: 'MOBILE_MONEY', receiptNumber: 'REC-007' },
  { id: 'p8', meetingId: 'm3', amount: 35000, status: PaymentStatus.PAID, date: '2024-06-05', payerName: 'Alex Johnson', method: 'CASH', receiptNumber: 'REC-008' },
  { id: 'p9', meetingId: 'm2', amount: 120000, status: PaymentStatus.PENDING, date: '2024-06-06', payerName: 'Dave Smith', method: 'BANK_TRANSFER' },
  { id: 'p10', meetingId: 'm4', amount: 200000, status: PaymentStatus.PAID, date: '2024-06-07', payerName: 'Elena Petrova', method: 'MOBILE_MONEY', receiptNumber: 'REC-010' },
  { id: 'p11', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-08', payerName: 'Mike Ross', method: 'BANK_TRANSFER', receiptNumber: 'REC-011' },
  { id: 'p12', meetingId: 'm3', amount: 35000, status: PaymentStatus.PAID, date: '2024-06-09', payerName: 'John Doe', method: 'CASH', receiptNumber: 'REC-012' },
  { id: 'p13', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-10', payerName: 'Boss Admin', method: 'MOBILE_MONEY', receiptNumber: 'REC-013' },
  { id: 'p14', meetingId: 'm2', amount: 120000, status: PaymentStatus.PAID, date: '2024-06-11', payerName: 'Sarah Miller', method: 'BANK_TRANSFER', receiptNumber: 'REC-014' },
  { id: 'p15', meetingId: 'm4', amount: 200000, status: PaymentStatus.PENDING, date: '2024-06-12', payerName: 'Alex Johnson', method: 'MOBILE_MONEY' },
  { id: 'p16', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-13', payerName: 'Elena Petrova', method: 'CASH', receiptNumber: 'REC-016' },
  { id: 'p17', meetingId: 'm3', amount: 35000, status: PaymentStatus.PAID, date: '2024-06-14', payerName: 'Mike Ross', method: 'BANK_TRANSFER', receiptNumber: 'REC-017' },
  { id: 'p18', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-15', payerName: 'John Doe', method: 'MOBILE_MONEY', receiptNumber: 'REC-018' },
  { id: 'p19', meetingId: 'm2', amount: 120000, status: PaymentStatus.PAID, date: '2024-06-15', payerName: 'Boss Admin', method: 'CASH', receiptNumber: 'REC-019' },
  { id: 'p20', meetingId: 'm4', amount: 200000, status: PaymentStatus.PAID, date: '2024-06-15', payerName: 'Sarah Miller', method: 'BANK_TRANSFER', receiptNumber: 'REC-020' },
  { id: 'p21', meetingId: 'm1', amount: 50000, status: PaymentStatus.PAID, date: '2024-06-16', payerName: 'Alex Johnson', method: 'MOBILE_MONEY', receiptNumber: 'REC-021' }
];
