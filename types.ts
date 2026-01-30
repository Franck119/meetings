
export enum PaymentStatus {
  PENDING = 'EN_ATTENTE',
  APPROVED = 'APPROUVÉ',
  PAID = 'PAYÉ',
  CANCELLED = 'ANNULÉ'
}

export enum MeetingFrequency {
  WEEKLY = 'HEBDOMADAIRE',
  BI_WEEKLY = 'BI-HEBDOMADAIRE',
  MONTHLY = 'MENSUEL'
}

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'APPROVE';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string; // Optional for list, required for creation
  role: 'SUPER_ADMIN' | 'FINANCE_MANAGER' | 'FINANCE_STAFF' | 'VIEWER';
  permissions: Permission[];
  avatar: string;
}

export interface Meeting {
  id: string;
  title: string;
  category: string;
  location: string;
  frequency: MeetingFrequency;
  contributionAmount: number;
  attendees: string[];
  nextDate: string;
  color: string;
  specifications?: string;
}

export interface Payment {
  id: string;
  meetingId: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  payerName: string;
  method: 'BANK_TRANSFER' | 'CASH' | 'MOBILE_MONEY' | 'CHECK';
  receiptNumber?: string;
  approvedBy?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}
