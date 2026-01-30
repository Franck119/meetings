import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MeetingList from './components/MeetingList';
import AssistantChat from './components/AssistantChat';
import PaymentModal from './components/PaymentModal';
import MeetingModal from './components/MeetingModal';
import DetailsModal from './components/DetailsModal';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import Login from './components/Login';
import DailyView from './components/DailyView';
import { NAV_ITEMS } from './constants';
import { Meeting, Payment, User } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Réunion Équipe',
      date: '2024-03-20',
      time: '10:00',
      location: 'Salle A',
      participants: ['Jean', 'Marie', 'Pierre'],
      frequency: 'weekly',
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      clientName: 'Client A',
      amount: 5000,
      dueDate: '2024-03-25',
      status: 'pending',
      description: 'Projet Web',
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'boss',
      password: '123',
      role: 'admin',
      permissions: ['all'],
    },
    {
      id: '2',
      username: 'jean',
      password: '123',
      role: 'user',
      permissions: ['view_dashboard', 'view_meetings', 'view_payments'],
    },
  ]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  };

  const handleAddPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = {
      ...payment,
      id: Date.now().toString(),
    };
    setPayments([...payments, newPayment]);
    setIsPaymentModalOpen(false);
  };

  const handleEditPayment = (payment: Payment) => {
    setPayments(payments.map((p) => (p.id === payment.id ? payment : p)));
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const handleAddMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting = {
      ...meeting,
      id: Date.now().toString(),
    };
    setMeetings([...meetings, newMeeting]);
    setIsMeetingModalOpen(false);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setMeetings(meetings.map((m) => (m.id === meeting.id ? meeting : m)));
    setIsMeetingModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  const openPaymentModal = (payment?: Payment) => {
    setSelectedPayment(payment || null);
    setIsPaymentModalOpen(true);
  };

  const openMeetingModal = (meeting?: Meeting) => {
    setSelectedMeeting(meeting || null);
    setIsMeetingModalOpen(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            meetings={meetings}
            payments={payments}
            onAddPayment={() => openPaymentModal()}
            onViewDetails={() => setIsDetailsModalOpen(true)}
          />
        );
      case 'meetings':
        return (
          <MeetingList
            meetings={meetings}
            onAddMeeting={() => openMeetingModal()}
            onEditMeeting={openMeetingModal}
            onDeleteMeeting={handleDeleteMeeting}
          />
        );
      case 'daily':
        return (
          <DailyView
            meetings={meetings}
            payments={payments}
            onAddPayment={() => openPaymentModal()}
          />
        );
      case 'reports':
        return <Reports payments={payments} meetings={meetings} />;
      case 'team':
        return (
          <UserManagement
            users={users}
            onAddUser={(user) => setUsers([...users, { ...user, id: Date.now().toString() }])}
            onEditUser={(user) => setUsers(users.map((u) => (u.id === user.id ? user : u)))}
            onDeleteUser={(id) => setUsers(users.filter((u) => u.id !== id))}
          />
        );
      case 'assistant':
        return <AssistantChat />;
      default:
        return (
          <Dashboard
            meetings={meetings}
            payments={payments}
            onAddPayment={() => openPaymentModal()}
            onViewDetails={() => setIsDetailsModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-50">
      <Sidebar
        navItems={NAV_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        currentUser={currentUser?.username || ''}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      {isPaymentModalOpen && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
          }}
          onSave={selectedPayment ? handleEditPayment : handleAddPayment}
        />
      )}

      {isMeetingModalOpen && (
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => {
            setIsMeetingModalOpen(false);
            setSelectedMeeting(null);
          }}
          onSave={selectedMeeting ? handleEditMeeting : handleAddMeeting}
        />
      )}

      {isDetailsModalOpen && (
        <DetailsModal
          payments={payments}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
