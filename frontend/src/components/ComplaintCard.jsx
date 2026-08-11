import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { MapPin, Calendar, Building2, Brain, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function ComplaintCard({ grievance }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-md group flex flex-col justify-between h-full space-y-4">
      {/* Top Header Section */}
      <div className="space-y-2.5">
        {/* Row 1: ID, Status & Date */}
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              #{grievance._id ? String(grievance._id).slice(-6) : 'ID'}
            </span>
            <StatusBadge status={grievance.status} />
          </div>

          <span className="text-[11px] text-slate-400 flex items-center space-x-1 shrink-0">
            <Calendar size={13} className="text-slate-500" />
            <span>{formatDate(grievance.createdAt)}</span>
          </span>
        </div>

        {/* Row 2: Priority & Severity + Category */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <PriorityBadge priority={grievance.priority} severityScore={grievance.severityScore} />
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 truncate max-w-[140px]">
            {grievance.category}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 pt-1">
          {grievance.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {grievance.description}
        </p>
      </div>

      {/* Middle Section: AI Summary */}
      {grievance.aiSummary && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 text-xs flex items-start space-x-2.5">
          <Brain size={16} className="text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-indigo-300 text-[11px] block">AI Intelligence Summary:</span>
            <p className="text-slate-300 line-clamp-2 leading-relaxed text-[11px]">{grievance.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Bottom Metadata & Action Footer */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5 min-w-0">
            <MapPin size={13} className="text-indigo-400 shrink-0" />
            <span className="truncate text-slate-300" title={grievance.location}>
              {grievance.location}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 min-w-0 justify-end">
            <Building2 size={13} className="text-purple-400 shrink-0" />
            <span className="truncate text-slate-300" title={grievance.assignedDepartment || 'General'}>
              {grievance.assignedDepartment || 'General'}
            </span>
          </div>
        </div>

        <Link
          to={`/grievances/${grievance._id}`}
          className="w-full py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 group-hover:border-indigo-500/50"
        >
          <span>View Details & Timeline</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
