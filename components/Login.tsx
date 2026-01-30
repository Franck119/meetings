
import React, { useState } from 'react';
import { Lock, User, Sparkles, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await onLogin(username, password);
    
    if (!success) {
      setError('Identifiants invalides. Accès refusé par Nex Intelligence.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 sm:p-6 relative overflow-hidden font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[48px] p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[28px] shadow-2xl mb-6 transform hover:rotate-12 transition-transform duration-500 border border-white/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Nex Intelligence</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Accès Système Sécurisé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Identifiant</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-white/5 border-2 border-transparent focus:border-indigo-500/30 rounded-[24px] py-4 pl-14 pr-6 text-white font-bold outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border-2 border-transparent focus:border-indigo-500/30 rounded-[24px] py-4 pl-14 pr-6 text-white font-bold outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-in slide-in-from-top-2">
                <p className="text-rose-400 text-[10px] font-black uppercase text-center tracking-widest leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authentification
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-black uppercase text-slate-600 tracking-[0.4em]">Propulsé par Nex IA Ecosystem</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
