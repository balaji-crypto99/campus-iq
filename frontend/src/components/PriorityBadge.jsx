import React from 'react';
import { getPriorityColor } from '../utils/formatters';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

export default function PriorityBadge({ priority, severityScore }) {
  const renderIcon = () => {
    switch (priority) {
      case 'CRITICAL':
        return <AlertOctagon size={12} className="mr-1 animate-pulse" />;
      case 'HIGH':
        return <AlertTriangle size={12} className="mr-1" />;
      default:
        return <Info size={12} className="mr-1" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
        priority
      )}`}
    >
      {renderIcon()}
      <span>{priority || 'MEDIUM'}</span>
      {severityScore !== undefined && (
        <span className="ml-1.5 opacity-80 border-l border-current pl-1.5 text-[10px]">
          {severityScore}/100
        </span>
      )}
    </span>
  );
}
