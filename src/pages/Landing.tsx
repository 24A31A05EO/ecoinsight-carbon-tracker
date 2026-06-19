import { Link } from 'react-router-dom';
import { Globe, ArrowRight, BrainCircuit, LineChart, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[800px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      </div>
      
      {/* Grid overlay */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_10%,transparent_100%)] pointer-events-none"></div>

      {/* Nav */}
      <nav className="relative z-10 w-full p-6 lg:p-8 flex items-center justify-between mx-auto max-w-7xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight">EcoInsight</h1>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-mono uppercase tracking-widest text-slate-400">
          <Link to="/app" className="hover:text-[var(--color-primary)] transition-colors hidden md:block">Dashboard</Link>
          <Link to="/app/tracker" className="hover:text-[var(--color-accent)] transition-colors hidden md:block">Track Activity</Link>
          <Link to="/app" className="px-6 py-2.5 rounded-none font-bold bg-[var(--color-primary)] text-slate-950 border border-[var(--color-primary)] shadow-[4px_4px_0_rgba(6,182,212,0.8)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_rgba(6,182,212,0.8)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-100">
            Start Eco Journey
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Typography */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900/80 border border-slate-700/50 text-[var(--color-primary)] text-xs font-mono uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_5px_var(--color-primary)]"></span>
            Version 3.0.4 Online
          </div>
          
          <h2 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter leading-[1.1]">
            <span className="block opacity-90">Understand</span>
            <span className="block opacity-70 mb-2">Today.</span>
            <span className="block eco-gradient-text drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">Reduce Tomorrow.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-xl leading-relaxed">
            The world's most advanced AI-powered sustainability platform. Transform daily habits into actionable carbon reduction insights.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link to="/app" className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-sm font-mono font-bold uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all duration-300">
              Calculate My Footprint
              <ArrowRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <div className="text-sm font-mono text-slate-500 uppercase flex flex-col justify-center gap-1">
              <span>+ Secure Data Storage</span>
              <span>+ Real-Time Carbon Insights</span>
            </div>
          </div>
        </div>

        {/* Right Visualizer */}
        <div className="flex-1 w-full relative">
          <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl glass-card border-slate-700/50 flex flex-col items-center justify-center overflow-hidden group">
             
             {/* Holographic earth visual fallback */}
             <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen pointer-events-none">
               <Globe className="w-[80%] h-[80%] text-[var(--color-primary)] animate-[spin_60s_linear_infinite]" strokeWidth={0.5} />
             </div>
             
             <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 p-4 rounded-xl flex items-center gap-4 shadow-xl transform -translate-x-4 translate-y-4 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
                     <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                       <LineChart size={24} />
                     </div>
                     <div>
                       <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">Global Index</div>
                       <div className="text-xl font-bold font-display text-white">+24.5% Opt.</div>
                     </div>
                   </div>
                   
                   <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 p-4 rounded-xl flex items-center gap-4 shadow-xl transform translate-x-4 -translate-y-2 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform duration-700 delay-100">
                     <div className="p-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded">
                       <ShieldCheck size={24} />
                     </div>
                     <div>
                       <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">Security</div>
                       <div className="text-xl font-bold font-display text-white">Maximum</div>
                     </div>
                   </div>
                </div>

                <div className="flex justify-center">
                   <div className="bg-slate-900/80 backdrop-blur-xl border border-[var(--color-primary)]/30 p-6 rounded-2xl w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.2)] transform translate-y-8 group-hover:-translate-y-4 transition-transform duration-[800ms] flex flex-col gap-4">
                     <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                       <div className="flex items-center gap-2 text-white font-mono text-sm tracking-widest uppercase">
                         <BrainCircuit size={16} className="text-[var(--color-primary)]" /> Carbon Processing
                       </div>
                       <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
                     </div>
                     <div className="space-y-3">
                       <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-[var(--color-primary)] w-[85%] relative shadow-[0_0_10px_currentColor]">
                           <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                         </div>
                       </div>
                       <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-[var(--color-accent)] w-[62%] relative shadow-[0_0_10px_currentColor]"></div>
                       </div>
                     </div>
                     <div className="text-xs text-slate-400 font-mono pt-2">Simulating environmental impact and carbon insights in real-time.</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

    </div>
  );
}
