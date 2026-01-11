
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'MARKETING' | 'LOGIN') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 glass-panel border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('MARKETING')}
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AgencyOS</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">Methodology</a>
          <a href="#contact" className="hover:text-white transition-colors">Case Studies</a>
        </div>

        <button 
          onClick={() => onNavigate('LOGIN')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
            currentView === 'LOGIN' 
            ? 'bg-slate-800 text-slate-300' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'
          }`}
        >
          AgencyOS Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
