import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Recommendation, UserStats } from '../types';
import { BrainCircuit, TrendingDown, DollarSign, Sparkles, Lightbulb, Activity, CalendarDays, ArrowRight } from 'lucide-react';

export default function AICoach() {
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
        <div className="flex flex-col items-center gap-4 text-[var(--color-accent)] font-mono animate-pulse">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <BrainCircuit size={40} className="text-[var(--color-primary)] animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[var(--color-accent)] border-r-[var(--color-transparent)] border-b-[var(--color-primary)] border-l-transparent animate-[spin_2s_linear_infinite]"></div>
          </div>
          Generating Eco Insights...
        </div>
      </div>
    );
  }

  // 1. Weekly Sustainability Report & Future Impact
  const weeklyFootprint = Math.round(stats.total_footprint_kg);
  const projectedYearly = weeklyFootprint * 52;
  const globalTarget = 2000;
  const isOverTarget = projectedYearly > globalTarget;

  // 2. Daily Eco Tip
  const dailyTips = [
    "Unplug devices to avoid standby 'vampire' power drain.",
    "Meatless Mondays can cut your weekly dietary footprint by up to 15%.",
    "Switching to LED bulbs saves up to 80% on lighting energy.",
    "Biking just 5km a day can offset 1kg of CO2.",
    "Wash clothes in cold water to save energy used for heating."
  ];
  const tipOfTheDay = dailyTips[new Date().getDay() % dailyTips.length];

  // 3. Personalized Carbon Reduction Suggestions
  const smartRecs: Recommendation[] = [];
  const transportEmissions = stats.activities.filter(a => a.category === 'transport').reduce((sum, a) => sum + a.footprint, 0);
  const electricityEmissions = stats.activities.filter(a => a.category === 'electricity').reduce((sum, a) => sum + a.footprint, 0);
  const foodEmissions = stats.activities.filter(a => a.category === 'food').reduce((sum, a) => sum + a.footprint, 0);

  if (transportEmissions > 15) {
    smartRecs.push({
      title: "Optimized Transit Path",
      description: "We detected high transport emissions. Replacing 2 car trips with public transit or biking this week can yield major reductions.",
      co2_savings_kg: 10.5,
      money_savings_usd: 8.0,
      difficulty: "Medium"
    });
  }

  if (electricityEmissions > 5) {
    smartRecs.push({
      title: "Thermal & AC Optimization",
      description: "Your electricity footprint is tracking high. Reduce AC cooling by 2 degrees and utilize fans or natural ventilation.",
      co2_savings_kg: 6.2,
      money_savings_usd: 4.5,
      difficulty: "Easy"
    });
  }

  if (foodEmissions > 15) {
    smartRecs.push({
      title: "Dietary Shift: Plant-Based",
      description: "Consider shifting away from high-impact meats (like beef/lamb) for 3 meals. This drastically impacts your footprint.",
      co2_savings_kg: 12.4,
      money_savings_usd: 15.0,
      difficulty: "Medium"
    });
  }

  if (smartRecs.length === 0) {
    smartRecs.push({
      title: "Vampire Power Sweep",
      description: "Unplug idle appliances (TVs, chargers, microwaves) before sleeping to prevent phantom energy draw.",
      co2_savings_kg: 2.1,
      money_savings_usd: 1.5,
      difficulty: "Easy"
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-10">
      <header className="pb-4 border-b border-slate-700/50">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl border border-[var(--color-primary)]/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">AI Eco Advisor</h2>
              <p className="text-slate-400 mt-1 font-medium">Smart, personalized recommendations to lower your carbon footprint.</p>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Tip */}
        <div className="glass-card p-6 border-[var(--color-highlight)]/30 bg-[var(--color-highlight)]/5 md:col-span-1">
          <h3 className="text-lg font-display font-semibold text-[var(--color-highlight)] flex items-center gap-2 mb-3">
            <Lightbulb size={20} />
            Daily Eco Tip
          </h3>
          <p className="text-slate-300 font-medium leading-relaxed">
            "{tipOfTheDay}"
          </p>
        </div>

        {/* Weekly Report & Future Prediction */}
        <div className="glass-card p-6 border-slate-700/50 relative overflow-hidden md:col-span-2">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-[40px] pointer-events-none"></div>
           <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2 mb-4">
             <CalendarDays size={20} className="text-[var(--color-primary)]" />
             Weekly Report & Future Impact
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Current Weekly Load</span>
                <span className="text-3xl font-display font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{weeklyFootprint} <span className="text-sm font-mono text-slate-400">kg</span></span>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Projected Yearly</span>
                <span className={`text-3xl font-display font-bold ${isOverTarget ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-[var(--color-primary)] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]'}`}>
                  {projectedYearly} <span className="text-sm font-mono text-slate-400">kg</span>
                </span>
              </div>
           </div>
           <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-sm text-slate-400">Target: <span className="text-white font-bold font-mono">2000 kg/year</span></span>
              <span className={`text-xs font-bold px-3 py-1 rounded uppercase tracking-wider ${isOverTarget ? 'bg-red-500/10 text-red-400' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                {isOverTarget ? 'Action Required' : 'On Track'}
              </span>
           </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display font-bold text-white mb-6 mt-8 flex items-center gap-2">
          <Activity size={24} className="text-[var(--color-accent)]" />
          Personalized Action Plan
        </h3>
        {smartRecs.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 font-mono border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
             <Sparkles className="mx-auto mb-4 text-[var(--color-primary)] opacity-50" size={48} />
             Great job! No crucial environmental corrections required currently based on your activity data.
          </div>
        ) : (
          <div className="grid gap-6">
            {smartRecs.map((rec, i) => (
              <div key={i} className="glass-card relative p-6 md:p-8 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300 group border-slate-700/50 overflow-hidden">
                 <div className="absolute right-[-5%] top-[-50%] w-64 h-64 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] opacity-5 hover:opacity-10 rounded-full blur-[50px] pointer-events-none transition-opacity duration-500"></div>
                 <div className="absolute right-4 top-4 text-[8rem] font-bold text-white/5 pointer-events-none font-display z-0 select-none hidden md:block group-hover:-translate-y-2 transition-transform duration-700">0{i+1}</div>

                 <div className="relative z-10 flex flex-col md:flex-row gap-8 md:items-center">
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-mono font-bold text-[10px] px-3 py-1.5 rounded uppercase tracking-widest">Recommended Actions</span>
                        <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded uppercase tracking-wider border ${
                          rec.difficulty.toLowerCase() === 'easy' ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)] bg-[var(--color-primary)]/5' :
                          rec.difficulty.toLowerCase() === 'medium' ? 'border-yellow-500/40 text-yellow-500 bg-yellow-500/5' :
                          'border-orange-500/40 text-orange-500 bg-orange-500/5'
                        }`}>
                          Difficulty: {rec.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3 group-hover:text-[var(--color-accent)] transition-colors">{rec.title}</h3>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">{rec.description}</p>
                   </div>

                   <div className="flex flex-row md:flex-col gap-6 md:gap-4 bg-slate-900/40 backdrop-blur-md p-6 rounded-xl border border-slate-700/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] min-w-[200px]">
                      <div className="flex-1">
                         <p className="text-[10px] text-slate-500 font-mono font-bold mb-2 uppercase tracking-widest">CO2 Savings</p>
                         <div className="flex items-baseline gap-2 text-[var(--color-primary)] font-bold text-3xl font-display drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                           <TrendingDown size={24} className="text-[var(--color-primary)]/80" />
                           {rec.co2_savings_kg}<span className="text-sm font-medium text-[var(--color-primary)]/60 font-mono">kg</span>
                         </div>
                      </div>
                      
                      <div className="w-px bg-slate-700/50 md:w-full md:h-px my-1 md:my-0"></div>

                      <div className="flex-1">
                         <p className="text-[10px] text-slate-500 font-mono font-bold mb-2 uppercase tracking-widest">Money Saved</p>
                         <div className="flex items-baseline gap-2 text-[var(--color-accent)] font-bold text-3xl font-display drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                           <DollarSign size={24} className="text-[var(--color-accent)]/80" />
                           {rec.money_savings_usd}<span className="text-sm font-medium text-[var(--color-accent)]/60 font-mono ml-1">USD</span>
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
