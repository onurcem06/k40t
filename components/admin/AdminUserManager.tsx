
import React, { useState } from 'react';
import { User, Trash2, Shield, Plus, Key, Check, X, Eye, ShieldCheck, Lock, CreditCard, UploadCloud } from 'lucide-react';
import { UserAccount, ClientProfile, UserRole } from '../../types.ts';

interface AdminUserManagerProps {
  users: UserAccount[];
  onUpdateUsers: (u: UserAccount[]) => void;
  clients: ClientProfile[];
}

const AdminUserManager: React.FC<AdminUserManagerProps> = ({ users, onUpdateUsers, clients }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: UserRole.CLIENT,
    clientId: clients[0]?.id || ''
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      id: `u_${Date.now()}`,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      clientId: formData.role === UserRole.CLIENT ? formData.clientId : undefined,
      permissions: { canViewPerformance: true, canEditTasks: false, canUploadAssets: false, canViewFinancials: false }
    };
    onUpdateUsers([...users, newUser]);
    setShowAddForm(false);
    setFormData({ username: '', password: '', role: UserRole.CLIENT, clientId: clients[0]?.id || '' });
  };

  const handleUpdateUser = (id: string, updates: Partial<UserAccount>) => {
    onUpdateUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const togglePermission = (userId: string, permission: keyof UserAccount['permissions']) => {
    onUpdateUsers(users.map(u => {
      if (u.id !== userId) return u;
      return { ...u, permissions: { ...u.permissions, [permission]: !u.permissions[permission] } };
    }));
  };

  return (
    <div className="space-y-12 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">ERİŞİM VE GÜVENLİK</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">SİSTEM KULLANICILARI VE ÖZEL YETKİ KALKANLARI</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-white text-black hover:bg-orange-600 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
          {showAddForm ? <><X size={14} /> VAZGEÇ</> : <><Plus size={14} /> YENİ HESAP OLUŞTUR</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddUser} className="bg-[#0D1225] p-10 rounded-[3rem] border border-orange-500/20 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in zoom-in-95">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase">KULLANICI ADI</label>
            <input required value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase">ŞİFRE</label>
            <input required type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase">ROL</label>
            <select value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value as any})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none">
              <option value={UserRole.CLIENT}>MÜŞTERİ</option>
              <option value={UserRole.EMPLOYEE}>ÇALIŞAN</option>
              <option value={UserRole.ADMIN}>ADMIN</option>
            </select>
          </div>
          {formData.role === UserRole.CLIENT && (
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase">MARKA BAĞLANTISI</label>
                <select required value={formData.clientId} onChange={(e)=>setFormData({...formData, clientId: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none">
                   {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
          )}
          <div className="flex items-end col-span-full lg:col-span-1">
            <button type="submit" className="w-full bg-orange-600 text-white p-4 rounded-xl font-black text-[10px] uppercase tracking-widest">HESABI OLUŞTUR</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-8">
        {users.map(u => (
          <div key={u.id} className="bg-[#0D1225] border border-white/5 p-10 rounded-[3.5rem] flex flex-col lg:flex-row gap-12 group transition-all hover:border-orange-500/20 shadow-2xl">
            <div className="lg:w-1/3 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-orange-500 border border-white/10 shadow-inner">
                  <User size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{u.username}</h4>
                  <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest">{u.role}</p>
                </div>
              </div>
              <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">BAĞLI MARKA / BİRİM</p>
                 <p className="text-[11px] font-black text-white uppercase">
                    {u.role === UserRole.CLIENT ? clients.find(c => c.id === u.clientId)?.name || 'Atanmamış' : 'AJANS İÇ EKİBİ'}
                 </p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setEditingUserId(u.id === editingUserId ? null : u.id)} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all flex items-center justify-center gap-2"><Key size={12}/> {editingUserId === u.id ? 'TAMAM' : 'ŞİFRE GÜNCELLE'}</button>
                 <button onClick={() => onUpdateUsers(users.filter(x=>x.id!==u.id))} className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 rounded-xl transition-all"><Trash2 size={16}/></button>
              </div>
              {editingUserId === u.id && (
                 <div className="animate-in slide-in-from-top-2">
                    <input type="password" placeholder="Yeni şifreyi yazın..." onChange={(e)=>handleUpdateUser(u.id, {password: e.target.value})} className="w-full bg-black/60 border border-orange-500/30 p-4 rounded-xl text-white font-bold" />
                 </div>
              )}
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { id: 'canViewPerformance', label: 'PERFORMANS ANALİZİ', desc: 'ROAS ve Harcama verilerini görebilir.', icon: Eye },
                 { id: 'canEditTasks', label: 'GÖREV YÖNETİMİ', desc: 'İş planı ve görevleri düzenleyebilir.', icon: ShieldCheck },
                 { id: 'canUploadAssets', label: 'VARLIK YÜKLEME', desc: 'Görsel ve video dosyası ekleyebilir.', icon: UploadCloud },
                 { id: 'canViewFinancials', label: 'FİNANSAL VERİLER', desc: 'Ajans hakediş ve bütçe detayları.', icon: CreditCard }
               ].map(p => (
                 <div 
                   key={p.id} 
                   onClick={() => togglePermission(u.id, p.id as any)}
                   className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center gap-6 ${
                     (u.permissions as any)[p.id] ? 'bg-orange-600/10 border-orange-500/30' : 'bg-black/10 border-white/5 opacity-50'
                   }`}
                 >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${(u.permissions as any)[p.id] ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-600'}`}>
                       <p.icon size={20} />
                    </div>
                    <div className="flex-1">
                       <p className={`text-[10px] font-black uppercase tracking-widest ${(u.permissions as any)[p.id] ? 'text-white' : 'text-slate-500'}`}>{p.label}</p>
                       <p className="text-[8px] font-bold text-slate-600 uppercase mt-1 leading-tight">{p.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-all ${ (u.permissions as any)[p.id] ? 'bg-orange-600' : 'bg-slate-800' }`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ (u.permissions as any)[p.id] ? 'right-1' : 'left-1' }`}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserManager;
