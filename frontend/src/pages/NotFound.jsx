import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
        <Brain size={36} />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          The intelligence route you requested does not exist or has been relocated.
        </p>
      </div>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
      >
        <ArrowLeft size={16} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
