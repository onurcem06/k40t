
import React from 'react';
import { LogOut, CheckCircle2, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import { SiteContent, Task } from '../types.ts';

interface EmployeeDashboardProps {
  content: SiteContent;
  tasks: Task[];
  onLogout: () => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ content, tasks, onLogout }) => {
  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <aside className="w-72 glass-panel border-r border-orange-500/10 flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl shadow-md flex items-center justify-center min-w-[36px]">
            <img src={content.branding.logoUrl} className="h-5 w-auto object-contain" alt="Worker Logo" />
          </div>
          <span className="font-black text-white text-xs tracking-tighter uppercase">WORKER PANEL</span>
        </div>
        <nav className="flex-1 p-6">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-4">İŞ AKIŞI</p>
          <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-orange-600 text-white shadow-lg shadow-orange-950/20 transition-all active:scale-95"><CheckCircle2 size={16} /> Görevlerim</button>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={onLogout} className="w-full text-slate-500 text-[10px] font-black uppercase py-4 hover:text-rose-500 transition-colors">ÇIKIŞ</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10 space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{content.portals.employee.welcomeMsg}</h1>
            <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">Atanmış toplam {tasks.length} görev var.</p>
          </div>
          <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4 bg-slate-950/20 shadow-xl shadow-black/20">
            <Clock className="text-orange-500" size={18} />
            <span className="text-xs font-black text-white">09:42:01</span>
          </div>
        </header>

        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{content.portals.employee.tasksHeader}</h3>
          {tasks.length > 0 ? tasks.map((task) => (
            <div key={task.id} className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-orange-500/20 transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500/10 transition-colors"><MessageSquare size={20} /></div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">{task.title}</p>
                  <p className="text-[10px] font-bold text-slate-600 mt-1">Öncelik: {task.priority}</p>
                </div>
              </div>
              <button className="bg-white/5 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-orange-500">
                <ArrowUpRight size={18} />
              </button>
            </div>
          )) : (
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Henüz görev atanmamış.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
