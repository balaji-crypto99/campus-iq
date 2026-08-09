import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { MapPin, Calendar, Building2, Brain, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function ComplaintCard({ grievance }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-md group relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            #{grievance._id ? grievance._id.slice(-6) : 'ID'}
          </span>
          <StatusBadge status={grievance.status} />
          <PriorityBadge priority={grievance.priority} severityScore={grievance.severityScore} />
        </div>

        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <Calendar size={14} />
          <span>{formatDate(grievance.createdAt)}</span>
        </span>
      </div>

      <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5 line-clamp-1">
        {grievance.title}
      </h4>

      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {grievance.description}
      </p>

      {/* AI Intelligence Summary Snippet */}
      {grievance.aiSummary && (
        <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs flex items-start space-x-2.5">
          <Brain size={16} className="text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-300">AI Intelligence Summary:</span>
            <p className="text-slate-400 line-clamp-2 leading-relaxed">{grievance.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Footer Info & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center space-x-4 text-slate-400">
          <span className="flex items-center space-x-1">
            <MapPin size={14} className="text-indigo-400" />
            <span className="truncate max-w-[120px]">{grievance.location}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Building2 size={14} className="text-purple-400" />
            <span className="truncate max-w-[120px]">{grievance.assignedDepartment || 'General'}</span>
          </span>
        </div>

        <Link
          to={`/grievances/${grievance._id}`}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
