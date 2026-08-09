import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { CATEGORIES, HOTSPOT_LOCATIONS } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { Brain, Send, CheckCircle2, AlertCircle, MapPin, Tag, FileText, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function GrievanceSubmit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Block B - 2nd Floor Corridor',
    category: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/grievances', formData);
      if (res.data.success) {
        setSubmissionResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      {!submissionResult ? (
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="space-y-2 border-b border-slate-800/80 pb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Brain size={14} />
              <span>AI Auto-Classification & Intelligence Routing Active</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Submit New Grievance</h1>
            <p className="text-sm text-slate-400">
              Provide complete details. Our AI engine will evaluate priority, detect duplicate complaints, and route directly to department heads.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Severe electrical sparks sparking near Block B Room 204"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Specific Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Block B - 2nd Floor Corridor"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category (Optional - AI will Auto-Detect)
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Let AI Classify Automatically</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Detailed Description *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what happened, duration of issue, number of students impacted, safety hazards..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Photo URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ImageIcon size={18} />
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Brain size={18} className="animate-spin" />
                  <span>Analyzing & Registering Grievance...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit & Execute AI Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Submission Success & AI Result View */
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 text-emerald-400">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Your grievance has been submitted.</h2>
              <p className="text-xs text-emerald-400">Ticket ID: #{submissionResult.grievance._id}</p>
            </div>
          </div>

          {/* AI Intelligence Summary Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Brain size={18} />
                <span className="font-bold text-sm text-white">AI Analysis & Auto-Routing Summary</span>
              </div>
              <PriorityBadge
                priority={submissionResult.grievance.priority}
                severityScore={submissionResult.grievance.severityScore}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Assigned Category:</span>
                <span className="font-semibold text-white">{submissionResult.grievance.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sub-Category:</span>
                <span className="font-semibold text-white">{submissionResult.grievance.subCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Routing Dept:</span>
                <span className="font-semibold text-indigo-300">{submissionResult.grievance.assignedDepartment}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Urgency SLA:</span>
                <span className="font-semibold text-amber-400">{submissionResult.grievance.urgency}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">AI Summary:</span>
              <p className="text-xs text-slate-400 leading-relaxed">{submissionResult.grievance.aiSummary}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-indigo-300">Recommended Administrative Response:</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
                {submissionResult.grievance.recommendedAction}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/grievances/${submissionResult.grievance._id}`}
              className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 text-center text-sm transition-all"
            >
              View Full Complaint & Timeline
            </Link>
            <Link
              to="/dashboard"
              className="w-full py-3 rounded-xl font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center text-sm transition-all"
            >
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
