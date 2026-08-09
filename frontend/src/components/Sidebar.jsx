import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  BarChart3,
  Brain,
  MapPin,
  Bell,
  User,
  Shield,
  CheckSquare,
} from 'lucide-react';

export default function Sidebar({ isOpen, closeSidebar }) {
  const { user } = useAuth();
  if (!user) return null;

  const isStudent = user.role === 'STUDENT';

  const studentLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Submit Grievance', path: '/submit', icon: PlusCircle },
    { name: 'My Complaints', path: '/my-grievances', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile Settings', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'All Grievances', path: '/admin/grievances', icon: CheckSquare },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'AI Insights & Reports', path: '/admin/ai-insights', icon: Brain },
    { name: 'Campus Hotspots', path: '/admin/hotspots', icon: MapPin },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const links = isStudent ? studentLinks : adminLinks;

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } transition-transform duration-200 ease-in-out flex flex-col justify-between`}
    >
      <div className="p-4 space-y-6">
        {/* Role Badge Banner */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Shield size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400 font-medium">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user.role} Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeSidebar}
                end={link.path === '/admin' || link.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AI Engine: Operational</span>
        </div>
      </div>
    </aside>
  );
}
