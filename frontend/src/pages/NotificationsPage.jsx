import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle, Info, AlertTriangle, AlertOctagon, Check } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotifications();

  const renderIcon = (type) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertOctagon size={20} className="text-red-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle size={20} className="text-amber-400 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle size={20} className="text-emerald-400 shrink-0" />;
      default:
        return <Info size={20} className="text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Notifications Center</h1>
          <p className="text-sm text-slate-400">Updates regarding your complaints and system alerts</p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => markAsRead('all')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-indigo-400 transition-colors flex items-center space-x-1.5"
          >
            <Check size={14} />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-2">
          <Bell size={32} className="text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No notifications available.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.read && markAsRead(n._id)}
              className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 cursor-pointer ${
                n.read
                  ? 'glass-card border-slate-800/80 opacity-75'
                  : 'bg-indigo-950/30 border-indigo-500/30 shadow-lg'
              }`}
            >
              {renderIcon(n.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[11px] text-slate-500">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

                {n.grievanceId && (
                  <Link
                    to={`/grievances/${n.grievanceId._id || n.grievanceId}`}
                    className="inline-block pt-1 text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    View Complaint Ticket →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
