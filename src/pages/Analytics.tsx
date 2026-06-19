import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    api.getUserStats().then(setStats);
  }, []);

  if (!stats) {
     return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-[var(--color-accent)] font-mono animate-pulse">
          <div className="w-16 h-16 rounded-full border-2 border-t-[var(--color-accent)] border-r-[var(--color-primary)] border-b-transparent border-l-transparent animate-spin"></div>
          Loading carbon insights...
        </div>
      </div>
    );
  }

  // Process data for charts
  // Group by category for Pie Chart
  const categoryTotals = stats.activities.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.footprint;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key.toUpperCase(),
    value: parseFloat(categoryTotals[key].toFixed(2))
  }));

  const COLORS = ['#10B981', '#06B6D4', '#3B82F6', '#22C55E'];

  // Process timeline data 
  const timelineData = [...stats.activities].reverse().map((act, i) => ({
    name: `Entry ${i+1}`,
    co2: act.footprint,
    category: act.category.substring(0, 3).toUpperCase()
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pb-2 flex items-center gap-4">
        <div className="p-3 bg-[var(--color-highlight)]/10 text-[var(--color-highlight)] rounded-xl border border-[var(--color-highlight)]/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <BarChart2 size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Carbon Analytics</h2>
          <p className="text-slate-400 mt-1 font-medium">Detailed breakdown of your environmental impact.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TIMELINE AREA CHART */}
        <div className="glass-card p-6 md:p-8 border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <h3 className="font-mono font-semibold text-slate-300 mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)] animate-pulse"></span>
            Carbon Footprint Trend
          </h3>
          <div className="h-64 relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'var(--color-accent)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: 'var(--color-accent)', fontWeight: 'bold', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="co2" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" activeDot={{ r: 6, fill: "var(--color-primary)", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUTION PIE CHART */}
        <div className="glass-card p-6 md:p-8 flex flex-col border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <h3 className="font-mono font-semibold text-slate-300 mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] animate-pulse"></span>
            Emissions by Category
          </h3>
          <div className="flex-1 min-h-[250px] relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'var(--color-primary)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend generated manually for pixel style */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Total Impact</div>
               <div className="text-3xl font-bold font-display text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{stats.total_footprint_kg}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8 z-10 relative">
             {pieData.map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-300 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/50 shadow-sm backdrop-blur-sm">
                 <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}></div>
                 <span>{entry.name} <span className="opacity-50">/</span> {entry.value}</span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
