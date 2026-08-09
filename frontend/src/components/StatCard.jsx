import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'indigo', subtitle }) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all shadow-lg">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3.5 rounded-xl border ${colorMap[color] || colorMap.indigo}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
