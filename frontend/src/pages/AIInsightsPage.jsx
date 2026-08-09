import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import HotspotMap from '../components/HotspotMap';
import { Brain, Sparkles, AlertOctagon, TrendingUp, CheckCircle, RefreshCw, FileText, MapPin } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function AIInsightsPage() {
  const [reportData, setReportData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [reportRes, locRes] = await Promise.all([
        API.post('/ai/daily-report'),
        API.get('/analytics/locations'),
      ]);

      if (reportRes.data.success) setReportData(reportRes.data);
      if (locRes.data.success) setLocations(locRes.data.hotspots);
    } catch (err) {
      console.error('Failed to load AI daily report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRegenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await API.post('/ai/daily-report');
      if (res.data.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Failed to regenerate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Generating AI Executive Campus Report from MongoDB statistics..." />;

  const report = reportData?.report;
  const stats = reportData?.stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Brain size={14} />
            <span>Autonomous Intelligence & Risk Warning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Campus Intelligence & Executive Daily Report</h1>
          <p className="text-sm text-slate-400">Synthesized insights based on live MongoDB grievance statistics</p>
        </div>

        <button
          onClick={handleRegenerateReport}
          disabled={generating}
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
          <span>{generating ? 'Synthesizing Data...' : 'Regenerate Daily Report'}</span>
        </button>
      </div>

      {/* Main Executive Report Document Card */}
      {report && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">{report.reportTitle}</h2>
                <p className="text-xs text-slate-400">
                  Generated on {formatDate(reportData.generatedAt)}
                </p>
              </div>
            </div>

            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border self-start sm:self-center ${
                report.riskLevel === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : report.riskLevel === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              Campus Risk Rating: {report.riskLevel}
            </span>
          </div>

          {/* Quick Metrics Strip */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Total Database Volume:</span>
                <span className="font-bold text-white text-sm">{stats.total} complaints</span>
              </div>
              <div>
                <span className="text-slate-500 block">New Submitted Today:</span>
                <span className="font-bold text-indigo-400 text-sm">{stats.newToday} complaints</span>
              </div>
              <div>
                <span className="text-slate-500 block">Critical Alerts:</span>
                <span className="font-bold text-red-400 text-sm">{stats.critical} active</span>
              </div>
              <div>
                <span className="text-slate-500 block">Primary Hotspot Location:</span>
                <span className="font-bold text-amber-400 text-sm">{stats.topLocation}</span>
              </div>
            </div>
          )}

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles size={14} />
              <span>AI Executive Summary</span>
            </h3>
            <p className="text-sm text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 leading-relaxed font-sans">
              {report.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Emerging Issues */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertOctagon size={14} />
                <span>Major Emerging Issues</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.emergingIssues?.map((issue, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 leading-relaxed">
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle size={14} />
                <span>Recommended Administrative Actions</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.recommendedActions?.map((action, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed">
                    ✓ {action}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Trend Analysis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp size={14} />
              <span>Campus Trend & Pattern Analysis</span>
            </h3>
            <p className="text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 leading-relaxed">
              {report.trendAnalysis}
            </p>
          </div>
        </div>
      )}

      {/* Campus Hotspots Matrix */}
      <HotspotMap hotspots={locations} />
    </div>
  );
}
