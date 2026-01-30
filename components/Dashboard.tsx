
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, CreditCard, Zap, Calendar, Sparkles, MapPin } from 'lucide-react';
import { Meeting, MeetingFrequency, Payment, PaymentStatus } from '../types';

interface DashboardProps {
  payments: Payment[];
  meetings: Meeting[];
  onAddPayment: () => void;
  onOpenDetails: (type: 'contributions' | 'pending' | 'meetings' | 'projection') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ payments, meetings, onAddPayment, onOpenDetails }) => {
  const formatCurrency = (val: number) => `${val.toLocaleString()} FCFA`;

  const totalReceived = payments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingPaymentsCount = payments
    .filter(p => p.status === PaymentStatus.PENDING).length;

  const projectedIncome = meetings.reduce((sum, m) => {
    let multiplier = 1;
    if (m.frequency === MeetingFrequency.WEEKLY) multiplier = 4;
    if (m.frequency === MeetingFrequency.BI_WEEKLY) multiplier = 2;
    return sum + (m.contributionAmount * multiplier);
  }, 0);

  const chartData = [
    { name: 'Lun', amount: 40000 },
    { name: 'Mar', amount: 30000 },
    { name: 'Mer', amount: 60000 },
    { name: 'Jeu', amount: 80000 },
    { name: 'Ven', amount: 50000 },
    { name: 'Sam', amount: 90000 },
    { name: 'Dim', amount: 70000 },
  ];

  const statusDistribution = [
    { name: 'Payé', value: totalReceived || 1, color: '#6366f1' },
    { name: 'En attente', value: payments.filter(p => p.status === PaymentStatus.PENDING).reduce((s, p) => s + p.amount, 0) || 1, color: '#f43f5e' },
    { name: 'Projeté', value: projectedIncome || 1, color: '#10b981' },
  ];

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* High-Impact Aesthetic Header - Reduced mobile height */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 text-white shadow-2xl border border-white/10 group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
          <Zap className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-indigo-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Intelligence Active</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3 h-3" />
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">Douala, Cameroun</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-6xl font-black tracking-tighter leading-tight sm:leading-none uppercase">
              Nex Intelligence <br className="hidden sm:block" /> <span className="text-indigo-400">Financial Hub</span>
            </h1>
            <p className="text-slate-300 font-medium text-sm sm:text-lg max-w-xl">
              Bonjour Boss. Votre empire financier est synchronisé. 
              <span className="text-white font-black block mt-1 sm:mt-2 text-xs sm:text-lg">{currentDate}</span>
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-2xl p-5 sm:p-8 rounded-[28px] sm:rounded-[40px] border border-white/10 shadow-2xl w-full sm:w-auto min-w-[200px] sm:min-w-[280px]">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-300 mb-1 sm:mb-2">Santé du Flux</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl sm:text-5xl font-black">94%</span>
              <span className="text-emerald-400 font-bold text-[10px] sm:text-sm mb-1 sm:mb-2">+2.4%</span>
            </div>
            <div className="mt-4 sm:mt-6 h-1.5 sm:h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[94%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Vue d'ensemble</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[8px] sm:text-xs uppercase tracking-widest">Performance & Métriques</p>
        </div>
        <button 
          onClick={onAddPayment}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-sm hover:border-indigo-500 transition-all active:scale-95"
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          Nouveau Flux
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
        <KPIVibrantCard 
          title="Total" 
          value={formatCurrency(totalReceived)} 
          subtitle="Mensuel"
          gradient="from-[#4f46e5] to-[#3730a3]"
          iconType="dollar"
          timeAware="2h"
          onClick={() => onOpenDetails('contributions')}
        />
        <KPIVibrantCard 
          title="Attente" 
          value={pendingPaymentsCount.toString()} 
          subtitle="File d'attente"
          gradient="from-[#f43f5e] to-[#be123c]"
          iconType="clock"
          timeAware="08:00"
          onClick={() => onOpenDetails('pending')}
        />
        <KPIVibrantCard 
          title="Réunions" 
          value={meetings.length.toString()} 
          subtitle="Calendrier"
          gradient="from-[#06b6d4] to-[#0891b2]"
          iconType="calendar"
          timeAware="3j"
          onClick={() => onOpenDetails('meetings')}
        />
        <KPIVibrantCard 
          title="Est." 
          value={formatCurrency(projectedIncome)} 
          subtitle="Vision J+30"
          gradient="from-[#10b981] to-[#059669]"
          iconType="chart"
          timeAware="J+30"
          onClick={() => onOpenDetails('projection')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-6 sm:mb-10">
            <h3 className="text-base sm:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Analyses</h3>
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Hebdomadaire</span>
          </div>
          <div className="h-[250px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} dx={-10} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', backgroundColor: '#1e293b', color: '#fff', padding: '12px', fontSize: '10px'}}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#trendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-6 sm:mb-10">
            <h3 className="text-base sm:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Répartition</h3>
            <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"><Zap className="w-4 h-4" /></button>
          </div>
          <div className="h-[250px] sm:h-[350px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Nex</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-0.5">Audit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPIVibrantCard = ({ title, value, subtitle, gradient, iconType, timeAware, onClick }: any) => {
  const renderBigIcon = () => {
    switch(iconType) {
      case 'dollar': return <span className="text-4xl sm:text-7xl font-black text-white/10 absolute -right-2 -bottom-2 sm:-bottom-6">FCFA</span>;
      case 'clock': return <Clock className="w-16 h-16 sm:w-28 sm:h-28 text-white/10 absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-8" />;
      case 'calendar': return <Calendar className="w-16 h-16 sm:w-28 sm:h-28 text-white/10 absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-8" />;
      case 'chart': return <TrendingUp className="w-16 h-16 sm:w-28 sm:h-28 text-white/10 absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-8" />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden p-5 sm:p-10 rounded-[28px] sm:rounded-[44px] bg-gradient-to-br ${gradient} text-white shadow-xl sm:shadow-2xl transition-all hover:scale-[1.03] active:scale-95 duration-500 group`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between gap-4 sm:gap-12">
        <div className="flex justify-between items-start">
           <div>
             <p className="text-white/60 text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1 sm:mb-2">{title}</p>
             <h4 className="text-base sm:text-3xl font-black tracking-tighter leading-none truncate max-w-[80px] sm:max-w-none">{value}</h4>
           </div>
           <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 text-[6px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
             <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
             {timeAware}
           </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
           <span className="text-white/60 text-[6px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{subtitle}</span>
           <div className="flex-1 h-[0.5px] sm:h-[1px] bg-white/20" />
           <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
        </div>
      </div>
      {renderBigIcon()}
    </div>
  );
};

export default Dashboard;
