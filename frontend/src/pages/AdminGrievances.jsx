import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES, DEPARTMENTS, PRIORITIES, STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { Search, Filter, ArrowUpDown, ChevronRight, CheckSquare, RefreshCw } from 'lucide-react';

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters & Search State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('severity');

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (departmentFilter) params.append('department', departmentFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await API.get(`/grievances?${params.toString()}`);
      if (res.data.success) {
        setGrievances(res.data.grievances);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch admin grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchGrievances, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, departmentFilter, categoryFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Master Grievance Database</h1>
          <p className="text-sm text-slate-400">Search, filter, assign, and manage all campus grievances</p>
        </div>

        <button
          onClick={fetchGrievances}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors flex items-center space-x-2 shrink-0"
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter Toolbar Panel */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Filter size={16} />
          <span>Multi-Parameter Filters & Search</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, student, location, ID..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ')}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((pr) => (
              <option key={pr} value={pr}>
                {pr}
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="severity">Sort: Highest Severity</option>
            <option value="priority">Sort: Priority Level</option>
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>

        </div>
      </div>

      {/* Table Data View */}
      {loading ? (
        <LoadingSpinner message="Querying grievance database..." />
      ) : grievances.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <p className="text-sm font-bold text-white">No grievances matched your active filters.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Title & Student</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Priority & Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Dept</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {grievances.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-indigo-400 font-bold">
                      #{g._id.slice(-6)}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-white truncate">{g.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{g.submittedBy?.name || 'Student'}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">{g.category}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[140px] truncate">{g.location}</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={g.priority} severityScore={g.severityScore} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="py-3.5 px-4 text-indigo-300 font-medium">{g.assignedDepartment}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/grievances/${g._id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Manage</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span>Showing {grievances.length} of {total} grievances</span>
          </div>
        </div>
      )}
    </div>
  );
}
