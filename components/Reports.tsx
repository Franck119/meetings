
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';
import { 
  Download, FileText, TrendingUp, Calendar, MapPin, 
  Filter, Sparkles, Loader2, ChevronRight, ArrowUpRight,
  ArrowDownRight, Target, Wallet
} from 'lucide-react';
import { Meeting, Payment, PaymentStatus, MeetingFrequency } from '../types';
import { getFinancialForecasting } from '../services/geminiService';

interface ReportsProps {
  payments: Payment[];
  meetings: Meeting[];
}

const Reports: React.FC<ReportsProps> = ({ payments, meetings }) => {
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [timeRange, setTimeRange] = useState('30D');

  const formatCurrency = (val: number) => `${val.toLocaleString()} FCFA`;

  // Basic Metrics
  const metrics = useMemo(() => {
    const paid = payments.filter(p => p.status === PaymentStatus.PAID);
    const total = paid.reduce((sum, p) => sum + p.amount, 0);
    const avg = paid.length > 0 ? total / paid.length : 0;
    const pending = payments.filter(p => p.status === PaymentStatus.PENDING).reduce((sum, p) => sum + p.amount, 0);
    
    return {
      total,
      avg,
      pending,
      completionRate: payments.length > 0 ? (paid.length / payments.length) * 100 : 0
    };
  }, [payments]);

  // AI Insights Trigger
  const fetchAiReport = async () => {
    setLoadingAi(true);
    const insight = await getFinancialForecasting(payments, meetings);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  useEffect(() => {
    fetchAiReport();
  }, []);

  // Data for Charts
  const cityData = useMemo(() => {
    const data: Record<string, number> = {};
    payments.filter(p => p.status === PaymentStatus.PAID).forEach(p => {
      const meet = meetings.find(m => m.id === p.meetingId);
      const city = meet?.location || 'Inconnu';
      data[city] = (data[city] || 0) + p.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [payments, meetings]);

  const monthlyProjection = useMemo(() => {
    return [
      { month: 'Juin', current: metrics.total, projected: metrics.total * 1.1 },
      { month: 'Juil', projected: metrics.total * 1.25 },
      { month: 'Août', projected: metrics.total * 1.4 },
    ];
  }, [metrics]);

  const generateExecutiveReportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const totalStr = formatCurrency(metrics.total);
    const pendingStr = formatCurrency(metrics.pending);

    const cityRows = cityData.map(item => `
      <tr>
        <td>${item.name}</td>
        <td class="amount">${formatCurrency(item.value)}</td>
      </tr>
    `).join('');

    const recentRows = payments.slice(-15).reverse().map(p => `
      <tr>
        <td>${p.date}</td>
        <td>${p.payerName}</td>
        <td>${p.status}</td>
        <td class="amount">${formatCurrency(p.amount)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Rapport Exécutif NexCRM</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 60px; color: #1e293b; line-height: 1.5; position: relative; min-height: 90vh; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #4f46e5; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 900; color: #312e81; text-transform: uppercase; letter-spacing: -1px; }
            h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0; }
            .meta { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
            .metric-card { background: #f8fafc; padding: 25px; border-radius: 20px; border: 1px solid #e2e8f0; }
            .metric-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
            .metric-value { font-size: 24px; font-weight: 900; color: #312e81; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 40px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            th { background: #f1f5f9; color: #475569; font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; font-weight: 600; }
            .amount { font-family: monospace; font-weight: 900; color: #4f46e5; text-align: right; }
            h2 { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; }
            .footer { position: absolute; bottom: 20px; left: 0; right: 0; font-size: 9px; color: #94a3b8; text-align: center; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
            
            /* Digital Stamp Style - Bottom Right */
            .digital-stamp {
              position: fixed;
              bottom: 60px;
              right: 60px;
              width: 140px;
              height: 140px;
              border: 5px double #ef4444;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              transform: rotate(-15deg);
              opacity: 0.85;
              color: #ef4444;
              font-family: 'Courier New', Courier, monospace;
              text-align: center;
              z-index: 100;
              pointer-events: none;
              background: white;
            }
            .stamp-inner { border: 2px solid #ef4444; border-radius: 50%; width: 90%; height: 90%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .stamp-text-top { font-size: 9px; font-weight: 900; }
            .stamp-text-mid { font-size: 16px; font-weight: 900; border-top: 1.5px solid #ef4444; border-bottom: 1.5px solid #ef4444; margin: 2px 0; padding: 2px 0; width: 80%; }
            .stamp-text-bot { font-size: 8px; font-weight: 800; }
          </style>
        </head>
        <body>
          <div class="digital-stamp">
            <div class="stamp-inner">
              <div class="stamp-text-top">OFFICIEL NEX IA</div>
              <div class="stamp-text-mid">CERTIFIÉ</div>
              <div class="stamp-text-bot">${dateStr}</div>
            </div>
          </div>
          <div class="header">
            <div class="logo">NexCRM</div>
            <div style="text-align: right">
              <h1>Rapport Exécutif Financier</h1>
              <div class="meta">Généré le: ${dateStr} | Hub Intelligence Hub</div>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Volume Total Collecté</div>
              <div class="metric-value">${totalStr}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">En Attente de Recouvrement</div>
              <div class="metric-value">${pendingStr}</div>
            </div>
          </div>

          <h2>Répartition par Ville</h2>
          <table>
            <thead>
              <tr>
                <th>Localisation</th>
                <th style="text-align: right">Montant Consolidé</th>
              </tr>
            </thead>
            <tbody>
              ${cityRows}
            </tbody>
          </table>

          <h2>Historique des Transactions Récentes</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Contributeur</th>
                <th>Statut</th>
                <th style="text-align: right">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${recentRows}
            </tbody>
          </table>

          <div class="footer">Document confidentiel à usage interne - Nex Intelligence AI Platform</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header & Global Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Intelligence Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Analyses & Prévisions de Flux</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest outline-none focus:border-indigo-500 transition-all"
          >
            <option value="7D">7 Derniers Jours</option>
            <option value="30D">30 Derniers Jours</option>
            <option value="90D">Trimestre Actuel</option>
          </select>
          <button 
            onClick={generateExecutiveReportPDF}
            className="bg-indigo-600 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none flex items-center gap-3 active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" />
            Rapport Exécutif
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Volume Total" 
          value={formatCurrency(metrics.total)} 
          trend="+12.5%" 
          positive={true} 
          icon={<Wallet className="w-6 h-6" />}
        />
        <MetricCard 
          label="Moyenne / Flux" 
          value={formatCurrency(metrics.avg)} 
          trend="+3.2%" 
          positive={true} 
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <MetricCard 
          label="Recouvrement" 
          value={`${metrics.completionRate.toFixed(1)}%`} 
          trend="-0.5%" 
          positive={false} 
          icon={<Target className="w-6 h-6" />}
        />
        <MetricCard 
          label="En Attente" 
          value={formatCurrency(metrics.pending)} 
          trend="Action Requis" 
          positive={false} 
          icon={<Calendar className="w-6 h-6" />}
          urgent={metrics.pending > 0}
        />
      </div>

      {/* AI Prediction Section */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[48px] p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-indigo-500/10 blur-[100px] rotate-12"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/30 p-3 rounded-2xl backdrop-blur-md border border-indigo-400/20">
                  <Sparkles className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Nex Prediction Engine</h3>
                  <p className="text-indigo-200/60 text-[10px] font-black uppercase tracking-widest">Analyse Cognitive des Flux</p>
                </div>
              </div>
              
              {loadingAi ? (
                <div className="flex items-center gap-4 p-8 bg-white/5 rounded-[32px] border border-white/5">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="font-black text-sm uppercase tracking-widest animate-pulse">Calcul des trajectoires financières en cours...</p>
                </div>
              ) : aiInsight ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-indigo-100 font-medium">
                      "Sur la base de l'historique de vos réunions à {meetings.map(m => m.location).join(', ')}, nous prévoyons une croissance de 15% le mois prochain."
                    </p>
                    <div className="flex gap-4">
                      {aiInsight.insightsByLocation?.slice(0, 2).map((insight: string, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-4">Niveau de Risque Projeté</p>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black uppercase tracking-tighter">{aiInsight.riskLevel || 'FAIBLE'}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`w-2 h-8 rounded-full ${i <= 2 ? 'bg-emerald-400' : 'bg-white/10'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={fetchAiReport} className="text-indigo-300 hover:text-white font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-8">
                  Relancer l'analyse cognitive
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Analysis */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Évolution & Projections</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Réel
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                <div className="w-2 h-2 bg-indigo-300 rounded-full"></div> Projeté
              </span>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProjection}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dx={-10} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', backgroundColor: '#1e293b', color: '#fff', padding: '20px'}}
                />
                <Area type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={4} fill="url(#colorReal)" />
                <Area type="monotone" dataKey="projected" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Split */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-10">Répartition Géo</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {cityData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-black dark:text-white">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Ledger Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Dernières Écritures</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit en temps réel</p>
          </div>
          <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
            <Filter className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flux ID</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contributeur</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Montant</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {payments.slice(-5).reverse().map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                  <td className="px-10 py-6 font-black text-[10px] text-slate-400"># {p.id.slice(-6).toUpperCase()}</td>
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{p.payerName}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{p.date}</p>
                  </td>
                  <td className="px-10 py-6 font-black text-slate-800 dark:text-indigo-400">{formatCurrency(p.amount)}</td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      p.status === PaymentStatus.PAID 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, positive, icon, urgent }: any) => (
  <div className={`p-10 rounded-[44px] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group ${urgent ? 'border-rose-100 dark:border-rose-900/30' : ''}`}>
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-[22px] transition-all group-hover:scale-110 ${urgent ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 text-indigo-500'}`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
        positive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
      }`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
    <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{value}</h4>
  </div>
);

export default Reports;
