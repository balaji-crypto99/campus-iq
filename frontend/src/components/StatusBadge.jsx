import React from 'react';
import { getStatusColor } from '../utils/formatters';

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status ? status.replace('_', ' ') : 'SUBMITTED'}
    </span>
  );
}
