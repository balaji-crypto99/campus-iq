import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart3, TrendingUp, ShieldAlert, CheckCircle, PieChart as PieIcon } from 'lucide-react';
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

export default function AnalyticsPage() {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [trends, setTrends] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        const [catRes, deptRes, trendRes, overRes] = await Promise.all([
          API.get('/analytics/categories'),
          API.get('/analytics/departments'),
          API.get('/analytics/trends'),
          API.get('/analytics/overview'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (deptRes.data.success) setDepartments(deptRes.data.departments);
        if (trendRes.data.success) setTrends(trendRes.data.trends);
        if (overRes.data.success) setOverview(overRes.data.stats);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAnalytics();
  }, []);

  if (loading || !overview) return <LoadingSpinner message="Generating campus data models..." />;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Grievance Analytics & Hotspot Forecasting</h1>
        <p className="text-sm text-slate-400">Quantitative operational breakdown of issues across departments & categories</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={overview.total} icon={BarChart3} color="indigo" />
        <StatCard title="Avg Severity Score" value={`${overview.avgSeverity}/100`} icon={ShieldAlert} color="purple" />
        <StatCard title="Active In-Progress" value={overview.inProgress} icon={TrendingUp} color="amber" />
        <StatCard title="Resolved Rate" value={`${Math.round((overview.resolved / (overview.total || 1)) * 100)}%`} icon={CheckCircle} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Table & Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Complaints Volume by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} interval={0} angle={-25} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 14-Day Influx Trend */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">14-Day Grievance Resolution Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Submitted" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Department Workload Summary Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Department Resolution Performance Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Total Grievances</th>
                <th className="py-3 px-4">Active In-Progress</th>
                <th className="py-3 px-4">Resolved Count</th>
                <th className="py-3 px-4">Efficiency %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {departments.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">{d.department}</td>
                  <td className="py-3 px-4 font-semibold text-indigo-400">{d.count}</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold">{d.inProgress}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{d.resolved}</td>
                  <td className="py-3 px-4 font-bold">
                    {Math.round((d.resolved / (d.count || 1)) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
