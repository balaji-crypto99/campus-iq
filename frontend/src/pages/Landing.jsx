import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Zap, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Check } from 'lucide-react';

export default function Landing() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Brain size={14} />
          <span>Next-Gen Campus Intelligence & Grievance Prevention</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Transform Student Complaints into <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Proactive Campus Intelligence</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Campus IQ leverages autonomous AI to auto-classify grievances, score priority severity, detect duplicate clusters, and empower campus administrators with early warning insights.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>Register as Student</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center space-x-2"
          >
            <span>Administrator Sign In</span>
          </Link>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-8 p-4 max-w-md mx-auto rounded-2xl glass-card border border-indigo-500/20 text-left text-xs text-slate-300 space-y-1">
          <div className="font-bold text-indigo-400 flex items-center justify-between">
            <span>🚀 Quick Demo Login Credentials:</span>
            <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">Seed Ready</span>
          </div>
          <p><span className="text-slate-400">Student:</span> <code className="text-white">student@campus.edu</code> / <code className="text-white">password123</code></p>
          <p><span className="text-slate-400">Admin:</span> <code className="text-white">admin@campus.edu</code> / <code className="text-white">password123</code></p>
        </div>
      </section>

      {/* Key Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Brain size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Autonomous AI Classification</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every submission is instantly evaluated for category, subcategory, sentiment, priority, and severe safety risk scores (0–100).
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Duplicate Cluster Prevention</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Detects recurring grievances across academic halls & residential hostels to identify major infrastructure failures early.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">On-Demand Executive Reports</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Administrators can generate daily AI executive summaries compiling campus statistics, critical hotspots, and action plans.
          </p>
        </div>
      </section>
    </div>
  );
}
