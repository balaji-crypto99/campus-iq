import React from 'react';
import { MapPin, AlertOctagon, Flame } from 'lucide-react';

export default function HotspotMap({ hotspots = [] }) {
  const getSeverityStyle = (count, avgSeverity) => {
    if (count > 10 || avgSeverity >= 75) {
      return {
        bg: 'bg-red-500/10 border-red-500/30 text-red-400',
        badge: 'bg-red-500 text-white',
        pulse: true,
      };
    }
    if (count > 5 || avgSeverity >= 50) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        badge: 'bg-amber-500 text-slate-950',
        pulse: false,
      };
    }
    return {
      bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      badge: 'bg-indigo-500 text-white',
      pulse: false,
    };
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Campus Issue Hotspot Matrix</h3>
        </div>
        <span className="text-xs text-slate-400">Live MongoDB Aggregation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotspots.map((item, idx) => {
          const style = getSeverityStyle(item.count, item.avgSeverity);
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${style.bg} transition-all hover:scale-[1.02] flex flex-col justify-between space-y-3 relative overflow-hidden`}
            >
              {style.pulse && (
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin size={18} />
                  <span className="font-bold text-sm text-white">{item.location}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {item.count} issues
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Severity:</span>
                  <span className="font-semibold">{item.avgSeverity}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Reports:</span>
                  <span className="font-semibold">{item.criticalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Top Category:</span>
                  <span className="font-semibold text-indigo-300">{item.topCategory || 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
