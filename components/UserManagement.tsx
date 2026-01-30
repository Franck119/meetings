
import React, { useState } from 'react';
import { User, Shield, UserPlus, Mail, Edit3, Trash2, CheckCircle2, X, Lock, UserCheck } from 'lucide-react';
import { User as UserType, Permission } from '../types';

interface UserManagementProps {
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'VIEWER' as UserType['role'],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'VIEWER',
    });
    setEditingUser(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password || '', 
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Permission mapping based on role
    const getPermissions = (role: UserType['role']): Permission[] => {
      switch(role) {
        case 'SUPER_ADMIN': return ['READ', 'WRITE', 'DELETE', 'APPROVE'];
        case 'FINANCE_MANAGER': return ['READ', 'WRITE', 'APPROVE'];
        case 'FINANCE_STAFF': return ['READ', 'WRITE'];
        default: return ['READ'];
      }
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        permissions: getPermissions(formData.role),
        password: formData.password
      } : u));
    } else {
      const newUser: UserType = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        permissions: getPermissions(formData.role),
        avatar: `https://picsum.photos/seed/${Date.now()}/100`,
      };
      setUsers([...users, newUser]);
    }
    
    setShowModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Gestion d'Équipe</h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">Contrôle des accès et niveaux de sécurité</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full sm:w-auto bg-[#4f46e5] text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl font-black shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 text-xs uppercase"
        >
          <UserPlus className="w-4 h-4 sm:w-5 h-5" />
          Nouvel Utilisateur
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="relative">
                <img src={user.avatar} className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 p-0.5" alt={user.name} />
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-emerald-500 text-white p-0.5 sm:p-1 rounded-lg border-2 border-white dark:border-slate-900">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              </div>
              <div className="flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(user)}
                  className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 sm:w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1 mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">{user.name}</h4>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400">
                <Mail className="w-3 h-3" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-indigo-400/70 mt-1 uppercase tracking-widest">
                <UserCheck className="w-3 h-3" />
                ID: {user.username}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Fonction</span>
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[8px] sm:text-[10px] font-black uppercase border border-indigo-100 dark:border-indigo-800/50">
                  {user.role}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.permissions.map(p => (
                  <span key={p} className="flex items-center gap-1 text-[7px] sm:text-[8px] font-black uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                    <Shield className="w-2 h-2" />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-[80vh] sm:h-auto rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-bottom-24 sm:zoom-in-95 duration-500">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-950/10">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {editingUser ? 'Modifier Profil' : 'Nouvelle Recrue'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Sécurité Nex</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom Complet</label>
                <input 
                  required
                  type="text"
                  placeholder="Ex: David Finance"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 rounded-xl outline-none text-sm font-bold transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Nex</label>
                  <input 
                    required
                    type="email"
                    placeholder="david@nexcrm.ai"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 rounded-xl outline-none text-sm font-bold transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
                  <input 
                    required
                    type="text"
                    placeholder="dfinance"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 rounded-xl outline-none text-sm font-bold transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de Passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 rounded-xl outline-none text-sm font-bold transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle & Fonctions</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 rounded-xl outline-none text-sm font-black transition-all dark:text-white cursor-pointer"
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN (BOSS)</option>
                  <option value="FINANCE_MANAGER">FINANCE MANAGER</option>
                  <option value="FINANCE_STAFF">FINANCE STAFF</option>
                  <option value="VIEWER">VIEWER (LECTURE SEULE)</option>
                </select>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                <button 
                  type="submit"
                  className="w-full bg-[#4f46e5] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-[#4338ca] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {editingUser ? 'Valider Modifications' : 'Enregistrer Recrue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
