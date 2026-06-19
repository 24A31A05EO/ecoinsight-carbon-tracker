import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Activity, BarChart2, Target, BrainCircuit, Globe } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen text-slate-200 flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-highlight)] opacity-10 blur-[120px] pointer-events-none"></div>

      {/* SIDEBAR / TOP NAVIGATION */}
      <nav className="w-full md:w-72 glass-panel z-50 flex flex-col md:h-screen sticky top-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="p-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white group-hover:scale-105 transition-transform">
            <Globe size={24} />
          </div>
          <NavLink to="/">
            <h1 className="font-display font-bold text-2xl text-white tracking-tight hover:text-[var(--color-primary)] transition-colors">
              EcoInsight
            </h1>
            <p className="text-[10px] text-[var(--color-accent)] font-mono uppercase tracking-wider">AI Sustainability Platform</p>
          </NavLink>
        </div>

        <div className="flex-1 py-6 flex md:flex-col gap-2 px-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
          <NavItem to="/app" icon={<LayoutDashboard size={20} />} label="Dashboard" exact />
          <NavItem to="/app/tracker" icon={<Activity size={20} />} label="Carbon Tracker" />
          <NavItem to="/app/analytics" icon={<BarChart2 size={20} />} label="Carbon Analytics" />
          <NavItem to="/app/goals" icon={<Target size={20} />} label="Eco Goals" />
          <NavItem to="/app/advisor" icon={<BrainCircuit size={20} />} label="AI Eco Advisor" />
        </div>

        <div className="hidden md:block p-6 border-t border-slate-800/50">
          <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]"></div>
            <div className="text-xs font-mono text-slate-300">
              System Online <br/>
              <span className="text-slate-500">v3.0 Quantum</span>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative h-[calc(100vh-80px)] md:h-screen overflow-y-auto w-full">
         <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto pb-24 md:pb-12 z-10 relative">
            <Outlet />
         </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, exact }: { to: string, icon: React.ReactNode, label: string, exact?: boolean }) {
  return (
    <NavLink 
      to={to} 
      end={exact}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm md:text-base whitespace-nowrap md:whitespace-normal group
        ${isActive 
          ? 'bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent text-[var(--color-primary)] shadow-[inset_2px_0_0_var(--color-primary)] border border-[var(--color-primary)]/10' 
          : 'text-slate-400 hover:bg-slate-800/40 hover:text-[var(--color-accent)] border border-transparent'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <div className={isActive ? 'text-[var(--color-primary)]' : 'text-slate-500 group-hover:text-[var(--color-accent)] transition-colors'}>
            {icon}
          </div>
          <span className="group-hover:translate-x-1 transition-transform">{label}</span>
        </>
      )}
    </NavLink>
  );
}
