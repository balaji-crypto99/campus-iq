import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEPARTMENTS, PRIORITIES, STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import {
  Brain,
  MapPin,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  Layers,
  ArrowLeft,
  RefreshCw,
  CheckSquare,
  Shield,
} from 'lucide-react';

export default function GrievanceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [message, setMessage] = useState('');

  // Admin form state
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await API.get(`/grievances/${id}`);
      if (res.data.success) {
        setGrievance(res.data.grievance);
        setAiAnalysis(res.data.aiAnalysis);
        setStatus(res.data.grievance.status);
        setPriority(res.data.grievance.priority);
        setDepartment(res.data.grievance.assignedDepartment);
      }
    } catch (err) {
      console.error('Failed to load grievance details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');

    try {
      const res = await API.put(`/grievances/${id}`, {
        status,
        priority,
        assignedDepartment: department,
      });

      if (res.data.success) {
        setGrievance(res.data.grievance);
        setMessage('Grievance details updated successfully.');
      }
    } catch (err) {
      setMessage('Failed to update grievance.');
    } finally {
      setUpdating(false);
    }
  };

  const handleReanalyzeAI = async () => {
    setReanalyzing(true);
    setMessage('');
    try {
      const res = await API.post(`/ai/analyze/${id}`);
      if (res.data.success) {
        setGrievance(res.data.grievance);
        setAiAnalysis(res.data.aiAnalysis);
        setMessage('AI Re-analysis completed.');
      }
    } catch (err) {
      setMessage('AI Re-analysis failed.');
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading || !grievance) return <LoadingSpinner message="Fetching complaint detail and AI matrix..." />;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Header Bar */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                Ticket #{grievance._id}
              </span>
              <StatusBadge status={grievance.status} />
              <PriorityBadge priority={grievance.priority} severityScore={grievance.severityScore} />
            </div>
            <h1 className="text-2xl font-extrabold text-white">{grievance.title}</h1>
          </div>

          {isAdmin && (
            <button
              onClick={handleReanalyzeAI}
              disabled={reanalyzing}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold text-xs transition-all flex items-center space-x-2 shrink-0"
            >
              <RefreshCw size={14} className={reanalyzing ? 'animate-spin' : ''} />
              <span>Retry AI Analysis</span>
            </button>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Lifecycle</h3>
          <Timeline grievance={grievance} />
        </div>

        {/* Original Complaint Content */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Original Student Complaint</h3>
          <p className="text-sm text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
            {grievance.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 pt-2">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-indigo-400" />
              <span><strong className="text-slate-300">Location:</strong> {grievance.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User size={16} className="text-purple-400" />
              <span><strong className="text-slate-300">Submitted By:</strong> {grievance.submittedBy?.name || 'Student'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-cyan-400" />
              <span><strong className="text-slate-300">Date:</strong> {formatDate(grievance.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Deep-Dive Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Autonomous AI Intelligence Diagnosis</h2>
              <p className="text-xs text-slate-400">Deep natural language evaluation & severity scoring matrix</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            Engine: {grievance.aiStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block mb-1">Detected Category</span>
            <span className="font-bold text-white text-sm">{grievance.category}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block mb-1">Subcategory</span>
            <span className="font-bold text-white text-sm">{grievance.subCategory || 'General'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block mb-1">Severity Score</span>
            <span className="font-bold text-indigo-400 text-sm">{grievance.severityScore}/100</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block mb-1">Sentiment Classification</span>
            <span className="font-bold text-purple-400 text-sm">{grievance.sentiment}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Executive Summary</h4>
          <p className="text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 leading-relaxed">
            {grievance.aiSummary || 'Summary pending.'}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Recommended Administrative Action</h4>
          <p className="text-xs text-indigo-200 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 leading-relaxed">
            {grievance.recommendedAction || 'Action recommendation pending.'}
          </p>
        </div>

        {aiAnalysis?.reasoning && (
          <div className="space-y-1 text-xs text-slate-400">
            <span className="font-bold text-slate-300">AI Priority Reasoning:</span>
            <p className="italic">{aiAnalysis.reasoning}</p>
          </div>
        )}
      </div>

      {/* Related / Duplicate Complaints Detection Cluster */}
      {grievance.relatedGrievances && grievance.relatedGrievances.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Potentially Related Complaints ({grievance.relatedGrievances.length})</h3>
          </div>
          <div className="space-y-3">
            {grievance.relatedGrievances.map((rel) => (
              <div
                key={rel._id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-indigo-400">#{rel._id.slice(-6)}</span>
                    <PriorityBadge priority={rel.priority} />
                    <StatusBadge status={rel.status} />
                  </div>
                  <p className="font-semibold text-slate-200">{rel.title}</p>
                </div>

                <Link
                  to={`/grievances/${rel._id}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold transition-colors"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Action Management Panel */}
      {isAdmin && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Administrator Action Console</h2>
              <p className="text-xs text-slate-400">Reassign department, adjust priority, or update resolution status</p>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              {message}
            </div>
          )}

          <form onSubmit={handleAdminUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Resolution Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {PRIORITIES.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all text-xs"
              >
                {updating ? 'Saving Changes...' : 'Save & Publish Updates'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
