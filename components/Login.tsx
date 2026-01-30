
import React, { useState, useEffect, useRef } from 'react';
import { Lock, User, Sparkles, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { User as UserType } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated "Instant" Login for Internal Tool
    setTimeout(() => {
      if ((username === 'boss' || username === 'admin') && password === 'admin') {
        onLoginSuccess(MOCK_USER);
      } else {
        setError("Identifiants de session invalides. Accès restreint.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden font-inter">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-[32px] shadow-2xl mb-8 border border-white/10 p-6">
              <ShieldCheck className="w-full h-full text-white" />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-3">Nex CRM</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Intelligence Interne
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Utilisateur</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  ref={inputRef}
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="boss"
                  className="w-full bg-slate-950/50 border-2 border-slate-800 focus:border-indigo-500/50 rounded-[24px] py-4.5 pl-14 pr-6 text-white font-bold outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Code d'Accès</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950/50 border-2 border-slate-800 focus:border-indigo-500/50 rounded-[24px] py-4.5 pl-14 pr-6 text-white font-bold outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-3xl animate-in shake duration-500 flex items-center gap-4">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Accéder au Hub <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
          <div className="mt-12 text-center border-t border-white/5 pt-8 text-[9px] font-black uppercase text-slate-700 tracking-[0.5em]">Protocol Nex CRM v4.0</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
