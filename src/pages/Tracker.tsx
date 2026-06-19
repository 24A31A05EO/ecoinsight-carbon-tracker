import React, { useState } from 'react';
import { api } from '../services/api';
import { Activity, Send, CheckCircle2, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tracker() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('transport');
  const [subCategory, setSubCategory] = useState<string>('car');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subOptions: Record<string, string[]> = {
    transport: ['car', 'bus', 'train', 'flight', 'bike'],
    electricity: ['ac', 'fan', 'tv', 'laptop'],
    food: ['beef', 'chicken', 'fish', 'vegetarian', 'vegan'],
    waste: ['plastic', 'recyclables', 'organic']
  };

  const getUnit = (cat: string) => {
    switch(cat) {
      case 'transport': return 'Kilometers (km)';
      case 'electricity': return 'Hours (hr)';
      case 'food': return 'Meals';
      case 'waste': return 'Kilograms (kg)';
      default: return 'Units';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    setLoading(true);
    await api.logActivity(category, subCategory, Number(amount));
    setLoading(false);
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/app');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pb-2 flex items-center gap-4">
        <div className="p-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-xl border border-[var(--color-accent)]/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Cpu size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Carbon Tracker</h2>
          <p className="text-slate-400 mt-1 font-medium">Record daily activities to track your environmental impact.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-8 relative overflow-hidden group border-slate-700/50">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-[var(--color-primary)] pointer-events-none transform group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
          <Activity size={180} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent pointer-events-none"></div>

        <div className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-3 uppercase tracking-widest">Emission Category</label>
            <div className="relative">
              <select 
                value={category} 
                onChange={(e) => {
                   setCategory(e.target.value);
                   setSubCategory(subOptions[e.target.value][0]);
                }}
                className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-600 p-4 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-inner appearance-none cursor-pointer"
              >
                <option value="transport">Transportation</option>
                <option value="food">Diet & Meals</option>
                <option value="electricity">Energy Consumption</option>
                <option value="waste">Waste & Disposal</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-mono">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-3 uppercase tracking-widest">Specific Activity</label>
            <div className="relative">
              <select 
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-600 p-4 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-inner appearance-none capitalize cursor-pointer"
              >
                {subOptions[category].map(opt => (
                  <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-mono">▼</div>
            </div>
          </div>

          <div>
             <label className="block text-xs font-mono font-bold text-[var(--color-primary)] mb-3 uppercase tracking-widest">Input Amount ({getUnit(category)})</label>
             <input 
               type="number"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="w-full bg-slate-900/80 backdrop-blur-sm border-2 border-[var(--color-primary)]/30 p-5 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-display font-bold text-3xl placeholder:text-slate-600 placeholder:font-light"
               placeholder="0.00"
               required
               min="0.1"
               step="0.1"
             />
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <button 
              disabled={loading || success}
              type="submit" 
              className={`w-full flex justify-center items-center gap-3 p-5 rounded-xl font-mono font-bold uppercase tracking-widest transition-all ${
                success 
                  ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)] shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-default'
                  : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-3">
                   <Activity className="animate-spin" size={20} /> Saving Activity...
                </span>
              ) : success ? (
                <span className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Activity Saved
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  LOG ACTIVITY <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
