import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Challenge, UserStats } from '../types';
import { Target, CheckCircle2, Award, Zap, Trophy, Leaf, Zap as Lightning, Car, Star } from 'lucide-react';

export default function Challenges() {
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
          Loading Goals...
        </div>
      </div>
    );
  }

  // Calculate dynamic goals based on actual user activities
  const transportEmissions = Math.round(stats.activities.filter(a => a.category === 'transport').reduce((sum, a) => sum + a.footprint, 0));
  const foodEmissions = Math.round(stats.activities.filter(a => a.category === 'food').reduce((sum, a) => sum + a.footprint, 0));
  const electricityEmissions = Math.round(stats.activities.filter(a => a.category === 'electricity').reduce((sum, a) => sum + a.footprint, 0));

  const smartChallenges: Challenge[] = [
    {
      id: "ch-1",
      title: "Green Transit Pioneer",
      description: "Limit your total transport emissions to under 50kg CO2 this week.",
      target_kg: 50,
      progress_kg: transportEmissions,
      completed: transportEmissions > 0 && transportEmissions < 50,
      reward_points: 300
    },
    {
      id: "ch-2",
      title: "Plant-Based Journey",
      description: "Keep your dietary footprint below 30kg CO2.",
      target_kg: 30,
      progress_kg: foodEmissions,
      completed: foodEmissions > 0 && foodEmissions < 30,
      reward_points: 250
    },
    {
      id: "ch-3",
      title: "Energy Saver",
      description: "Monitor and limit your electricity usage to under 20kg CO2.",
      target_kg: 20,
      progress_kg: electricityEmissions,
      completed: electricityEmissions > 0 && electricityEmissions < 20,
      reward_points: 150
    }
  ];

  const badges = [
    { id: 'b1', name: 'First Action', desc: 'Logged your first activity', icon: <Star size={20} />, unlocked: stats.activities.length >= 1 },
    { id: 'b2', name: 'Consistent', desc: 'Logged 5+ activities', icon: <Award size={20} />, unlocked: stats.activities.length >= 5 },
    { id: 'b3', name: 'Low Impact', desc: 'Total emissions < 100kg', icon: <Leaf size={20} />, unlocked: stats.total_footprint_kg > 0 && stats.total_footprint_kg < 100 },
    { id: 'b4', name: 'Eco Champion', desc: 'Achieved Level 3+', icon: <Trophy size={20} />, unlocked: stats.level >= 3 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <header className="pb-2">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-[var(--color-highlight)]/10 text-[var(--color-highlight)] rounded-xl border border-[var(--color-highlight)]/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
             <Target size={32} />
           </div>
           <div>
             <h2 className="text-3xl font-display font-bold text-white tracking-tight">Eco Goals</h2>
             <p className="text-slate-400 mt-1 font-medium">Complete sustainability challenges to maximize your eco score.</p>
           </div>
        </div>
      </header>

      {/* Weekly Smart Challenges */}
      <div>
        <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
          <Zap size={20} className="text-yellow-400" />
          Smart Weekly Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {smartChallenges.map(challenge => {
              const progressRatio = Math.min(100, Math.round((challenge.progress_kg / challenge.target_kg) * 100));
              const isFailing = challenge.progress_kg > challenge.target_kg;
              
              return (
                <div 
                  key={challenge.id} 
                  className={`glass-card p-6 flex flex-col transition-all duration-500 relative overflow-hidden group ${
                    challenge.completed 
                      ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5 shadow-[0_4px_30px_rgba(16,185,129,0.15)]' 
                      : isFailing
                      ? 'border-red-500/30'
                      : 'border-slate-700/50 hover:border-[var(--color-accent)]/50 hover:shadow-[0_4px_30px_rgba(6,182,212,0.1)]'
                  }`}
                >
                    {challenge.completed && (
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--color-primary)] opacity-20 rounded-full blur-[40px] pointer-events-none"></div>
                    )}

                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-white pointer-events-none transform group-hover:scale-125 transition-transform duration-700">
                       <Target size={100} />
                    </div>

                    <div className="flex justify-between items-start mb-6 relative z-10 border-b border-slate-700/50 pb-4">
                       <h3 className={`font-display font-bold text-lg leading-snug ${challenge.completed ? 'text-white' : 'text-slate-200'}`}>{challenge.title}</h3>
                       {challenge.completed ? (
                         <CheckCircle2 className="text-[var(--color-primary)] flex-shrink-0 ml-3 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" size={24} />
                       ) : isFailing ? (
                         <div className="text-xs font-bold font-mono text-red-400 bg-red-400/10 px-2 py-1 rounded">EXCEEDED</div>
                       ) : (
                         <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex-shrink-0 ml-3 group-hover:border-[var(--color-accent)] transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)_inset]"></div>
                       )}
                    </div>
                    
                    <p className="text-sm font-medium text-slate-400 mb-8 flex-1 relative z-10">
                      {challenge.description}
                    </p>

                    <div className="space-y-3 mt-auto relative z-10 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                       <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Progress</span>
                          <span className={challenge.completed ? 'text-[var(--color-primary)] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : isFailing ? 'text-red-400' : 'text-[var(--color-accent)]'}>
                            {challenge.progress_kg} / {challenge.target_kg} kg
                          </span>
                       </div>
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,1)] border border-slate-700/50">
                          <div 
                            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] relative ${challenge.completed ? 'bg-[var(--color-primary)]' : isFailing ? 'bg-red-500' : 'bg-[var(--color-accent)]'}`}
                            style={{ width: `${progressRatio}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20"></div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center relative z-10 px-1">
                       <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <Award size={14} className={challenge.completed ? "text-[var(--color-primary)]" : "text-slate-500"} /> Completion Reward
                       </span>
                       <span className={`text-sm font-bold font-mono ${challenge.completed ? 'text-[var(--color-primary)] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-slate-300'}`}>
                         +{challenge.reward_points} XP
                       </span>
                    </div>
                </div>
              );
           })}
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
          <Trophy size={20} className="text-[var(--color-primary)]" />
          Achievement Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                badge.unlocked 
                  ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'
              }`}
            >
              <div className={`p-3 rounded-full mb-3 ${badge.unlocked ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-slate-800 text-slate-500'}`}>
                {badge.icon}
              </div>
              <h4 className={`font-bold font-display ${badge.unlocked ? 'text-white' : 'text-slate-400'}`}>{badge.name}</h4>
              <span className="text-xs text-slate-500 mt-1">{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

