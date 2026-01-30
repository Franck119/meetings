
import React from 'react';
import { X, Download, FileText, CheckCircle2, TrendingUp, MapPin, Clock, Calendar } from 'lucide-react';
import { Meeting, Payment, PaymentStatus, MeetingFrequency } from '../types';

interface DetailsModalProps {
  type: 'contributions' | 'pending' | 'meetings' | 'projection';
  meetings: Meeting[];
  payments: Payment[];
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ type, meetings, payments, onClose }) => {
  const filteredPayments = payments.filter(p => {
    if (type === 'contributions') return p.status === PaymentStatus.PAID;
    if (type === 'pending') return p.status === PaymentStatus.PENDING || p.status === PaymentStatus.APPROVED;
    return false;
  });

  const generatePDFMock = (title: string, content: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const dateStr = new Date().toLocaleDateString('fr-FR');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 60px; color: #1e293b; line-height: 1.5; position: relative; min-height: 90vh; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #4f46e5; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 900; color: #312e81; text-transform: uppercase; letter-spacing: -1px; }
            h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0; }
            .meta { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 30px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
            th { background: #f8fafc; color: #475569; font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 16px; text-align: left; border-bottom: 2px solid #e2e8f0; }
            td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; }
            .amount { font-family: monospace; font-weight: 900; color: #4f46e5; text-align: right; }
            .total-box { margin-top: 40px; background: #312e81; color: white; padding: 30px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; }
            .total-label { font-size: 12px; font-weight: 900; text-transform: uppercase; opacity: 0.7; }
            .total-val { font-size: 32px; font-weight: 900; }
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
              <h1>${title}</h1>
              <div class="meta">Généré le: ${dateStr} | Dossier: AI-FIN-${Date.now()}</div>
            </div>
          </div>
          ${content}
          <div class="footer">NexCRM Intelligence Financial Audit - Official Executive Document</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadReport = () => {
    let content = '';
    let total = 0;

    if (type === 'contributions' || type === 'pending') {
      content = '<table><thead><tr><th>Date</th><th>Bénéficiaire</th><th>Réunion & Lieu</th><th>Statut</th><th>Montant</th></tr></thead><tbody>';
      filteredPayments.forEach(p => {
        const m = meetings.find(meet => meet.id === p.meetingId);
        content += `<tr><td>${p.date}</td><td>${p.payerName}</td><td>${m?.title} - ${m?.location}</td><td>${p.status}</td><td class="amount">${p.amount.toLocaleString()} FCFA</td></tr>`;
        total += p.amount;
      });
      content += `</tbody></table><div class="total-box"><span class="total-label">Audit Financier Global</span><span class="total-val">${total.toLocaleString()} FCFA</span></div>`;
    } else if (type === 'meetings') {
      content = '<table><thead><tr><th>Réunion</th><th>Catégorie</th><th>Lieu</th><th>Fréquence</th><th>Contribution</th></tr></thead><tbody>';
      meetings.forEach(m => {
        content += `<tr><td>${m.title}</td><td>${m.category}</td><td>${m.location}</td><td>${m.frequency}</td><td class="amount">${m.contributionAmount.toLocaleString()} FCFA</td></tr>`;
      });
      content += `</tbody></table><div class="total-box"><span class="total-label">Nombre de Réunions Actives</span><span class="total-val">${meetings.length}</span></div>`;
    } else if (type === 'projection') {
      content = '<table><thead><tr><th>Réunion</th><th>Lieu</th><th>Impact / Séance</th><th>Fréquence</th><th>Valeur Mensuelle</th></tr></thead><tbody>';
      meetings.forEach(m => {
        let mult = 1;
        if (m.frequency === MeetingFrequency.WEEKLY) mult = 4;
        if (m.frequency === MeetingFrequency.BI_WEEKLY) mult = 2;
        const monthlyVal = m.contributionAmount * mult;
        content += `<tr><td>${m.title}</td><td>${m.location}</td><td class="amount">${m.contributionAmount.toLocaleString()} FCFA</td><td>${m.frequency}</td><td class="amount">${monthlyVal.toLocaleString()} FCFA</td></tr>`;
        total += monthlyVal;
      });
      content += `</tbody></table><div class="total-box"><span class="total-label">Projection Mensuelle Consolidée</span><span class="total-val">${total.toLocaleString()} FCFA</span></div>`;
    }

    generatePDFMock(`Rapport d'Audit ${type.toUpperCase()}`, content);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    const m = meetings.find(meet => meet.id === payment.meetingId);
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const content = `
      <div style="border: 10px solid #f8fafc; padding: 60px; border-radius: 48px; background: white; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
           <div style="width: 80px; height: 80px; background: #4f46e5; border-radius: 24px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; font-weight: 900;">N</div>
           <h2 style="font-size: 12px; font-weight: 900; color: #4f46e5; text-transform: uppercase; letter-spacing: 4px;">Certificat de Paiement Officiel</h2>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px;">
           <div style="background: #f8fafc; padding: 30px; border-radius: 24px;">
              <p style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Contributeur</p>
              <p style="font-size: 18px; font-weight: 900; color: #1e293b; margin: 0;">${payment.payerName}</p>
           </div>
           <div style="background: #f8fafc; padding: 30px; border-radius: 24px;">
              <p style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Réunion & Zone</p>
              <p style="font-size: 18px; font-weight: 900; color: #1e293b; margin: 0;">${m?.title} • ${m?.location}</p>
           </div>
        </div>

        <div style="text-align: center; background: #312e81; color: white; padding: 50px; border-radius: 32px; margin-bottom: 60px;">
           <p style="font-size: 12px; font-weight: 900; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px;">Montant Total Acquitté</p>
           <h3 style="font-size: 60px; font-weight: 900; margin: 10px 0;">${payment.amount.toLocaleString()} <span style="font-size: 20px; opacity: 0.5;">FCFA</span></h3>
           <p style="font-size: 14px; font-weight: 700; opacity: 0.8;">Méthode: ${payment.method} | Réf: ${payment.id}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <p style="font-size: 11px; font-weight: 900; color: #1e293b; text-transform: uppercase;">Date de Validation</p>
            <p style="font-size: 16px; font-weight: 800; color: #4f46e5;">${payment.date}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 11px; font-weight: 900; color: #1e293b; text-transform: uppercase; margin-bottom: 20px;">Sceau du Boss Admin</p>
            <div style="width: 180px; height: 80px; border: 4px dashed #e2e8f0; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #cbd5e1; text-transform: uppercase;">Signature Électronique</div>
          </div>
        </div>
      </div>
    `;
    generatePDFMock(`REÇU_${payment.payerName.toUpperCase()}`, content);
  };

  const titles = {
    contributions: 'Audit des Contributions Payées',
    pending: 'Paiements Suspendus / En Attente',
    meetings: 'Structure des Réunions Actives',
    projection: 'Modèle de Projection Mensuelle'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[92vh] sm:h-auto sm:max-h-[92vh] rounded-t-[48px] sm:rounded-[56px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-bottom-24 sm:zoom-in-95 duration-500">
        <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 dark:bg-slate-950/20 gap-4">
          <div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">{titles[type]}</h3>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Données certifiées conformes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadReport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#4f46e5] text-white rounded-[20px] sm:rounded-[24px] font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#4338ca] transition-all shadow-xl"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              PDF Global
            </button>
            <button onClick={onClose} className="p-3 sm:p-4 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-[18px] sm:rounded-[22px] text-slate-400 hover:text-rose-500 transition-all">
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 custom-scrollbar bg-white dark:bg-slate-900">
          {type === 'contributions' || type === 'pending' ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredPayments.map(p => {
                const m = meetings.find(meet => meet.id === p.meetingId);
                return (
                  <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] sm:rounded-[40px] border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all group gap-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${p.status === PaymentStatus.PAID ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-500'}`}>
                        {p.status === PaymentStatus.PAID ? <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" /> : <Clock className="w-6 h-6 sm:w-8 sm:h-8" />}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white text-lg sm:text-xl uppercase tracking-tighter">{p.payerName}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                           <Calendar className="w-3 h-3 text-indigo-500" />
                           <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{m?.title} • {p.date}</span>
                           <div className="flex items-center gap-1 ml-2 text-indigo-400">
                             <Clock className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Enregistré à 14:32</span>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto justify-end">
                      <div className="text-left sm:text-right">
                         <p className="font-black text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400 tracking-tighter">{p.amount.toLocaleString()} FCFA</p>
                         <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Montant Certifié</p>
                      </div>
                      <button 
                        onClick={() => handleDownloadReceipt(p)}
                        className="p-4 sm:p-5 bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 rounded-[20px] sm:rounded-3xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all"
                        title="Imprimer Reçu PDF"
                      >
                        <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredPayments.length === 0 && (
                <div className="text-center py-32 opacity-30">
                  <p className="font-black uppercase tracking-[0.5em] text-xs">Registre Vide</p>
                </div>
              )}
            </div>
          ) : type === 'meetings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {meetings.map(m => (
                <div key={m.id} className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[48px] border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${m.color} rounded-[18px] sm:rounded-[24px] shadow-xl flex items-center justify-center text-white`}>
                       <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white text-lg sm:text-xl uppercase tracking-tighter leading-none">{m.title}</h4>
                      <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{m.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-xl sm:rounded-2xl">
                       <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fréquence</p>
                       <p className="text-xs sm:text-sm font-black text-indigo-600 uppercase">{m.frequency}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-xl sm:rounded-2xl">
                       <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact</p>
                       <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">{m.contributionAmount.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                  {m.specifications && (
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Spécifications</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2">"{m.specifications}"</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-50 dark:border-slate-700 pt-4">
                     <span>Prochaine session</span>
                     <span className="text-indigo-500">Dans 3 jours</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-8">
              <div className="p-8 sm:p-12 bg-gradient-to-br from-[#312e81] to-[#4f46e5] text-white rounded-[40px] sm:rounded-[56px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10">
                <div className="text-center md:text-left">
                  <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Projection Mensuelle Consolidée</p>
                  <h4 className="text-4xl sm:text-6xl font-black tracking-tighter">
                    {meetings.reduce((s, m) => {
                      let mult = 1;
                      if (m.frequency === MeetingFrequency.WEEKLY) mult = 4;
                      if (m.frequency === MeetingFrequency.BI_WEEKLY) mult = 2;
                      return s + (m.contributionAmount * mult);
                    }, 0).toLocaleString()} <span className="text-lg sm:text-2xl opacity-50">FCFA</span>
                  </h4>
                </div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-[30px] sm:rounded-[40px] backdrop-blur-md flex items-center justify-center border border-white/20">
                   <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <h5 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 sm:px-6 mt-4">Analyse Détaillée par Flux</h5>
                {meetings.map(m => {
                  let mult = 1;
                  if (m.frequency === MeetingFrequency.WEEKLY) mult = 4;
                  if (m.frequency === MeetingFrequency.BI_WEEKLY) mult = 2;
                  const monthlyVal = m.contributionAmount * mult;
                  return (
                    <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] sm:rounded-[32px] border border-slate-100 dark:border-slate-800 gap-4">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${m.color} shadow-lg shadow-indigo-100 dark:shadow-none`} />
                        <div>
                           <p className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm sm:text-base">{m.title}</p>
                           <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.location} • {mult} séances / mois</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                         <p className="font-black text-xl sm:text-2xl text-slate-800 dark:text-white tracking-tighter">{monthlyVal.toLocaleString()} FCFA</p>
                         <div className="flex justify-start sm:justify-end mt-1">
                            <span className="text-[8px] sm:text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase">Calcul Échéant</span>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
