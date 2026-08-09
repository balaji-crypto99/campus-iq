export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'HIGH':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'MEDIUM':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'LOW':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'RESOLVED':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'IN_PROGRESS':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'ASSIGNED':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'PENDING':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'SUBMITTED':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'REJECTED':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};
