
import React from 'react';
import { User, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { ContactMessage } from '../../types.ts';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onUpdateMessages: (m: ContactMessage[]) => void;
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onUpdateMessages }) => {
  return (
    <div className="space-y-12">
      <header className="border-b border-white/5 pb-8">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">İLETİŞİM TALEPLERİ</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">({messages.length}) YENİ MESAJ</p>
      </header>

      <div className="space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className="bg-[#0D1225] border border-white/5 p-10 rounded-[3rem] group relative overflow-hidden transition-all hover:border-orange-500/20">
             <div className="absolute top-0 left-0 w-1 h-full bg-orange-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
             <div className="flex flex-col md:flex-row justify-between gap-10">
                <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5 shadow-inner"><User size={28} /></div>
                      <div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-tight">{msg.name}</h4>
                         <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Mail size={12} className="text-orange-500"/> {msg.email}</span>
                            <span className="flex items-center gap-2"><Phone size={12} className="text-orange-500"/> {msg.phone}</span>
                            <span className="flex items-center gap-2"><Calendar size={12} className="text-orange-500"/> {new Date(msg.date).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>
                   <div className="bg-black/30 p-8 rounded-[2rem] border border-white/5 text-slate-300 text-base leading-relaxed italic shadow-inner">
                      "{msg.message}"
                   </div>
                </div>
                <button onClick={() => onUpdateMessages(messages.filter(m=>m.id!==msg.id))} className="self-start text-rose-500/20 hover:text-rose-500 transition-colors p-4 hover:bg-rose-500/10 rounded-2xl"><Trash2 size={28} /></button>
             </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="py-32 border-2 border-dashed border-white/5 rounded-[4rem] text-center opacity-30">
            <p className="text-xs font-black uppercase tracking-widest">Gelen kutusu temiz.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
