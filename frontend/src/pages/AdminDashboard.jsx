import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatCard from '../components/StatCard';
import ComplaintCard from '../components/ComplaintCard';
import HotspotMap from '../components/HotspotMap';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle,
  AlertOctagon,
  AlertTriangle,
  Brain,
  BarChart3,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recentGrievances, setRecentGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, catRes, deptRes, locRes, trendRes, listRes] = await Promise.all([
        API.get('/analytics/overview'),
        API.get('/analytics/categories'),
        API.get('/analytics/departments'),
        API.get('/analytics/locations'),
        API.get('/analytics/trends'),
        API.get('/grievances?limit=6&sortBy=severity'),
      ]);

      if (overviewRes.data.success) setStats(overviewRes.data.stats);
      if (catRes.data.success) setCategories(catRes.data.categories);
      if (deptRes.data.success) setDepartments(deptRes.data.departments);
      if (locRes.data.success) setLocations(locRes.data.hotspots);
      if (trendRes.data.success) setTrends(trendRes.data.trends);
      if (listRes.data.success) setRecentGrievances(listRes.data.grievances);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading || !stats) return <LoadingSpinner message="Aggregating live campus intelligence..." />;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Intelligence Master Console</h1>
          <p className="text-sm text-slate-400">AI-driven early warning dashboard & grievance control center</p>
        </div>

        <Link
          to="/admin/ai-insights"
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Brain size={18} />
          <span>Generate AI Daily Report</span>
        </Link>
      </div>

      {/* Critical Alert Warning Banner */}
      {stats.critical > 0 && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertOctagon size={24} className="shrink-0" />
            <div>
              <p className="font-extrabold text-sm">🚨 {stats.critical} CRITICAL GRIEVANCES REQUIRING IMMEDIATE RESPONSE</p>
              <p className="text-xs text-red-300">Safety risks or major infrastructure disruptions identified by AI engine.</p>
            </div>
          </div>
          <Link
            to="/admin/grievances?priority=CRITICAL"
            className="px-3.5 py-1.5 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-colors shrink-0"
          >
            Review Critical List
          </Link>
        </div>
      )}

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Total Complaints" value={stats.total} icon={FileText} color="indigo" />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Wrench} color="purple" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" />
        <StatCard title="Critical Risk" value={stats.critical} icon={AlertOctagon} color="red" />
        <StatCard title="High Priority" value={stats.high} icon={AlertTriangle} color="cyan" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Complaints by Category */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Grievances by Category</h3>
            <span className="text-xs text-slate-400">Total Count</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories.slice(0, 7)}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Grievances Over Time (Trends) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Grievance Trends (Past 14 Days)</h3>
            <span className="text-xs text-slate-400">Daily Influx</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Workload Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Department Workload Distribution</h3>
            <span className="text-xs text-slate-400">Active vs Resolved</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments.slice(0, 6)} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} hide />
                <YAxis dataKey="department" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Priority & Category Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Top Category Proportions</h3>
            <span className="text-xs text-slate-400">Percentage %</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories.slice(0, 5)}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {categories.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Campus Issue Hotspot Matrix */}
      <HotspotMap hotspots={locations} />

      {/* High Severity Recent Grievances Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Highest Severity Grievances</h2>
          <Link
            to="/admin/grievances"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View Master Database</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentGrievances.map((grievance) => (
            <ComplaintCard key={grievance._id} grievance={grievance} />
          ))}
        </div>
      </div>
    </div>
  );
}
