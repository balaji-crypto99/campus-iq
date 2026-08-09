import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatCard from '../components/StatCard';
import ComplaintCard from '../components/ComplaintCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, FileText, Clock, Wrench, CheckCircle, Search, Brain } from 'lucide-react';

export default function StudentDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMyGrievances = async () => {
    try {
      const res = await API.get('/grievances');
      if (res.data.success) {
        setGrievances(res.data.grievances);
      }
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGrievances();
  }, []);

  const totalSubmitted = grievances.length;
  const pending = grievances.filter((g) => ['SUBMITTED', 'PENDING'].includes(g.status)).length;
  const inProgress = grievances.filter((g) => ['ASSIGNED', 'IN_PROGRESS'].includes(g.status)).length;
  const resolved = grievances.filter((g) => g.status === 'RESOLVED').length;

  const filtered = grievances.filter((g) => {
    const term = search.toLowerCase();
    return (
      g.title.toLowerCase().includes(term) ||
      g.description.toLowerCase().includes(term) ||
      g.category.toLowerCase().includes(term) ||
      g.location.toLowerCase().includes(term)
    );
  });

  if (loading) return <LoadingSpinner message="Fetching your student dashboard..." />;

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Grievance Portal</h1>
          <p className="text-sm text-slate-400">Track and submit campus grievances backed by autonomous AI</p>
        </div>

        <Link
          to="/submit"
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <PlusCircle size={18} />
          <span>Submit Grievance</span>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Submitted" value={totalSubmitted} icon={FileText} color="indigo" />
        <StatCard title="Pending Review" value={pending} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={inProgress} icon={Wrench} color="purple" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="emerald" />
      </div>

      {/* Search & Grievances Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">My Submitted Grievances</h2>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, category, location..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
            <Brain className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Grievances Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't submitted any complaints matching this query yet.
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-colors"
            >
              <PlusCircle size={16} />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((grievance) => (
              <ComplaintCard key={grievance._id} grievance={grievance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
