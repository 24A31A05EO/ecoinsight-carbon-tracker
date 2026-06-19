import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserStats } from '../types';
import { Link } from 'react-router-dom';
import { Leaf, Zap, Car, Trash2, ArrowRight, Activity, Flame, Award, Shield, Flag, Database, Wind, Globe, Sparkles, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUserStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-[var(--color-primary)] font-mono animate-pulse">
          <div className="w-16 h-16 rounded-full border-2 border-t-[var(--color-primary)] border-r-[var(--color-accent)] border-b-transparent border-l-transparent animate-spin"></div>
          Initializing Dashboard...
        </div>
      </div>
    );
  }

  // Get most recent activities
  const recent = stats.activities.slice(0, 3);

  const getIcon = (category: string) => {
    switch(category) {
      case 'transport': return <Car size={16} />;
      case 'electricity': return <Zap size={16} />;
      case 'food': return <Leaf size={16} />;
      case 'waste': return <Trash2 size={16} />;
      default: return <Activity size={16} />;
    }
  };
  
  const getBadgeIcon = (iconName: string) => {
    switch(iconName) {
      case 'Flag': return <Flag size={20} className="text-[var(--color-highlight)]" />;
      case 'Zap': return <Zap size={20} className="text-yellow-400" />;
      case 'Database': return <Database size={20} className="text-[var(--color-primary)]" />;
      case 'Wind': return <Wind size={20} className="text-[var(--color-accent)]" />;
      default: return <Award size={20} className="text-[var(--color-secondary)]" />;
    }
  };

  const xpProgress = Math.min(100, (stats.current_xp / stats.next_level_xp) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HERO SECTION */}
      <section className="glass-card p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4">
           <div className="relative w-64 h-64 md:w-96 md:h-96 opacity-20">
              <Globe className="w-full h-full text-[var(--color-primary)] animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full shadow-[0_0_100px_rgba(16,185,129,0.5)] transform group-hover:scale-110 transition-transform duration-700"></div>
           </div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-mono uppercase mb-6 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Sparkles size={14} className="animate-pulse" />
            <span>Carbon Insights Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4 leading-tight">
            EcoInsight
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-accent)] font-light mb-6 uppercase tracking-wider">
            "Understand Today. Reduce Tomorrow."
          </p>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Your personal sustainability engine. We process your daily activities to find the best ways to reduce your carbon footprint.
          </p>
        </div>
      </section>

      {/* GAMIFICATION LEVEL BAR */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden border-slate-700/50">
         {/* Decorative blob inside card */}
         <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[60px] pointer-events-none"></div>

         <div className="flex-shrink-0 text-center relative z-10">
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-slate-900/80 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] border border-[var(--color-primary)]/30 backdrop-blur-md">
              <Shield size={64} className="text-[var(--color-primary)] opacity-20 absolute" />
              <div className="text-5xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                {stats.level}
              </div>
            </div>
            <div className="text-xs text-[var(--color-primary)] font-mono mt-4 uppercase tracking-widest">Sustainability Lvl</div>
         </div>
         
         <div className="flex-1 w-full space-y-4 z-10">
            <div className="flex justify-between items-end font-mono text-xs text-slate-400 uppercase tracking-wider">
               <span>Total XP: <strong className="text-white text-sm">{stats.current_xp}</strong></span>
               <span>Target: {stats.next_level_xp}</span>
            </div>
            <div className="h-4 bg-slate-900/50 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
               <div 
                 className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] relative transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                 style={{ width: `${xpProgress}%` }}
               >
                 <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:24px_24px] animate-[slide-bg_1s_linear_infinite]"></div>
               </div>
            </div>
            <p className="text-xs text-slate-400 font-mono">Consistently logging activities helps you reach your eco goals faster.</p>
         </div>
         
         {/* STREAK */}
         <div className="flex-shrink-0 text-center border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8 z-10">
            <div className="flex items-center gap-3 justify-center">
              <Flame size={32} className={stats.daily_streak > 0 ? "text-[#f97316] drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse" : "text-slate-600"} />
              <span className="text-4xl font-display font-bold text-white tracking-widest">{stats.daily_streak}</span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-3 uppercase tracking-widest">Day Streak</div>
         </div>
      </div>
      
      {/* BADGES SECTION */}
      <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group border-slate-700/50">
        <h3 className="font-display font-semibold text-xl text-white mb-6 flex items-center gap-3">
          <Award className="text-[var(--color-accent)]" />
          Eco Achievements
        </h3>
        {stats.badges.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {stats.badges.map(badge => (
                <div key={badge.id} className="bg-slate-900/40 backdrop-blur-md rounded-xl p-5 flex flex-col items-center text-center gap-3 border border-slate-700/50 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-[var(--color-accent)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/badge">
                   <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity"></div>
                   <div className="p-4 bg-slate-800/80 rounded-full border border-slate-600/50 text-[var(--color-primary)] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover/badge:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-shadow">
                      {getBadgeIcon(badge.icon)}
                   </div>
                   <h4 className="text-sm font-semibold text-white tracking-wide">{badge.name}</h4>
                   <p className="text-[11px] text-slate-400 leading-tight">{badge.description}</p>
                </div>
             ))}
          </div>
        ) : (
          <div className="text-center font-mono text-sm text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-700/50 p-8">
             Complete green actions to earn eco achievements.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ECO SCORE */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden group border-slate-700/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/20 to-transparent rounded-bl-full pointer-events-none transition-all duration-700 group-hover:scale-125 opacity-50" />
          <h3 className="font-mono font-semibold text-[var(--color-primary)] mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
            <BrainCircuit size={16} /> Eco Score
          </h3>
          <div className="text-7xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2">
            {stats.eco_score}
          </div>
          <div className="inline-block px-3 py-1 rounded bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_10px_rgba(16,185,129,0.2)] mt-2">
            Green Champion
          </div>
          <p className="text-sm text-slate-400">Your current sustainability rating.</p>
        </div>

        {/* FOOTPRINT */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden group border-slate-700/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/20 to-transparent rounded-bl-full pointer-events-none transition-all duration-700 group-hover:scale-125 opacity-50" />
          <h3 className="font-mono font-semibold text-[var(--color-accent)] mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
            <Activity size={16} /> Total Carbon Footprint
          </h3>
          <div className="flex items-baseline mb-6">
            <div className="text-7xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              {stats.total_footprint_kg}
            </div>
            <span className="text-3xl text-slate-500 ml-3 font-medium">kg</span>
          </div>
          <p className="text-sm text-slate-400">Calculated output based on your tracked activities.</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-2xl relative border-slate-700/50">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
          <h3 className="font-display font-semibold text-xl text-white">Recent Activities</h3>
          <Link to="/app/tracker" className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-2 rounded-lg border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
            Track New Activity
          </Link>
        </div>

        <div className="space-y-4">
          {recent.map((act) => (
            <div key={act.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[var(--color-primary)] transition-all group">
               <div className="flex items-center gap-4">
                  <div className="text-[var(--color-accent)] p-3 bg-[var(--color-accent)]/10 rounded-xl border border-[var(--color-accent)]/20 group-hover:bg-[var(--color-accent)]/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    {getIcon(act.category)}
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wide text-slate-200">{act.category} — {act.subCategory.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">{new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-lg font-bold text-white">+{act.footprint} kg</div>
                  <div className="text-[10px] uppercase font-bold text-[var(--color-accent)] tracking-widest mt-1">CO2e</div>
               </div>
            </div>
          ))}

          {recent.length === 0 && (
             <div className="text-center p-10 text-slate-500 text-sm font-mono bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
               No activities logged yet.
             </div>
          )}
        </div>

        <div className="mt-8 text-center pt-4 border-t border-slate-700/50">
          <Link to="/app/analytics" className="inline-flex items-center justify-center gap-2 text-[var(--color-highlight)] text-sm font-bold uppercase tracking-widest hover:text-white hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all group">
            View Carbon Analytics <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
